const Sondaggio = require("./sondaggio");
const User = require("./user");
var db = require('../../db-consts');

class ModelF{
    constructor(){
        this.sondaggio = new Sondaggio(db.CONNLIMIT, db.HOST, db.USER, db.PASS, db.DATABASE, db.DEBUGMODE);
        this.user = new User(db.CONNLIMIT, db.HOST, db.USER, db.PASS, db.DATABASE, db.DEBUGMODE);
    }
    insertSondaggio(sondaggio){
        this.sondaggio.insertSondaggio(sondaggio)
    }
    getSondaggio(req, res, next){
        this.sondaggio.getSondaggio(req, res, next)
    }
    insertResult(req, res, next){
        this.sondaggio.insertResult(req, res, next)
    }
    insertUser(email){
        this.user.insertUser(email)
    }
    getUser(req, res, next){
        this.user.getUser(req, res, next)
    }
}
module.exports = ModelF