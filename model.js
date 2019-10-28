const mysql = require('mysql');

class Model{
    constructor(host, user, password, database) {
        this.pool =  mysql.createPool({
            connectionLimit : 100,
            host,
            user,
            password,
            database,
            debug    :  true
        });
    }
    createPoolConnection(f) {
        this.pool.getConnection((err,conn) => {
            if (err) {
                console.error("Errore nella get connection");
                throw err;
            }
            conn.beginTransaction(err => {
                if(err){
                    console.error("Errore inizio transazione");
                    throw err;
                }
                f(conn);
            });
        });
    }

    insertSondaggio(sondaggio) {
        this.createPoolConnection((conn) => {
            console.info("Inserimento sondaggio");
            conn.query(
                'INSERT INTO sondaggio(nome,descrizione) values(?,?)', 
                [sondaggio.nome, sondaggio.descrizione], 
                (err, result) => {
                    if (err) { 
                        conn.rollback(() => {
                            console.error("Rollback in seguito a errore inserimento sondaggio");
                            throw err;
                        });
                    }
                    console.info("Inserimento domande sondaggio");
                    console.log('result:',result,'error',err)

                    let id = result.insertId;
                    console.log('sondaggio:',sondaggio);
                    if(sondaggio) {
                        let domande = sondaggio.domande;
                        const l = domande.length;
                        for(let i = 0; i < l; i++) {
                            conn.query(
                                'INSERT INTO domanda(id_sondaggio, testo) values(?,?)', 
                                [id, domande[i]],
                                (err, result) => {
                                    if (err) { 
                                        conn.rollback(() => {
                                            console.error("Rollback in serguito a errore inserimento domanda");
                                                throw err;
                                        });
                                    }
                                }
                            );
                            conn.commit( err => {
                                if (err) {
                                    conn.rollback(err => {
                                        throw err;
                                    });
                                }
                            });
                        }
                    }
                }
            );
        });
    }
    
    getSondaggio(req, res, next) {
        this.createPoolConnection(conn => {
            console.info("Recupero sondaggio");
            conn.query(
                'SELECT id, nome as titolo, descrizione FROM sondaggio s WHERE s.id=?',
                req.params.sondaggioId, 
                (err, result) => {
                    if(err){
                        console.error('Errore nel recupero del sondaggio', err);
                        throw err;
                    }
                    result = result[0];
                    conn.query(
                        'SELECT id, testo FROM domanda WHERE id_sondaggio=? ORDER BY id',
                        req.params.sondaggioId,
                        (err, result_domande) => {
                            if(err){
                                console.error('Errorre nel recupero delle domande del sondaggio', err);
                                throw err;
                            }
                            if(result){
                                result.domande = result_domande;
                            }
                            res.json(result);
                        }
                    );
                }
            );
        });
    }
}
module.exports = Model