const Model = require("../model");

class User extends Model{
  
    insertUser(email) {
        this.createPoolConnection((conn) => {
            console.log('Inserimento nuovo utente');
            if(Utils.validateEmail(email)){
                conn.query(
                    'INSERT INTO user (email) VALUES (?)',
                    email,
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
            }else{
                console.error("Username sbagliato");
            }
        });
    }

    getUser(req, res, next) {
        this.createPoolConnection(conn => {
            console.info("Recupero sondaggio");
            conn.query(
                'SELECT id,email FROM user u WHERE u.id=?',
                req.params.userId, 
                (err, result) => {
                    if(err){
                        console.error("Errore nel recupero dell'utente", err);
                        throw err;
                    }
                    result = result[0];
                    res.json(result);
                }
            );
        });
    }
    
}
module.exports = User