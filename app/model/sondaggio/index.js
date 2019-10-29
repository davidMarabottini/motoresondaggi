const Model = require("../model");

class Sondaggio extends Model{
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

    insertResult(req, res, next) {
        this.createPoolConnection((conn) => {
            console.log('Inserimento nuovo risultato');
            console.log(req.body);
            console.log(req.params);
            req.body.forEach(function(val){
                let els = val.split('|');
                els.unshift(req.params.userId);
                console.info('els',els);
                conn.query(
                    'INSERT INTO risposta (id_user, id_domanda, valore) VALUES (?,?,?)',
                    els,
                    (err, result) => {
                        if (err) { 
                            conn.rollback(() => {
                                console.error("Rollback in serguito a errore inserimento username");
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
            })
        });
    }

    // getRisposteSondaggio(req, res, next) {
    //     const sondaggio = this.getSondaggio(req, res, next);
    //     console.info('il mio sondaggio è il seguente: ', sondaggio)
    // }
}
module.exports = Sondaggio