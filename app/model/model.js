const mysql = require('mysql');
const Utils = require("../../utils/validations");

class Model{
    constructor(connectionLimit, host, user, password, database, debug) {
        this.pool =  mysql.createPool({ connectionLimit, host, user, password, database, debug });
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


}
module.exports = Model