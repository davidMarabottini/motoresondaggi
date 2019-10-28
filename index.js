const express = require("express");
const bodyParser = require("body-parser");
const Model = require("./model");
var db = require('./db-consts');
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let model = new Model(db.HOST, db.USER, db.PASS, db.DATABASE);

app.listen(3000, () =>{
	console.log("Server is running on port 3000");
});

app.get("/sondaggio/:sondaggioId",(req, res, next) => {
	model.getSondaggio(req, res, next);
});

app.post("/user",(req, res, next) => {

})

app.post("/sondaggio",(req, res, next) => {
	model.insertSondaggio(req.body);
	res.status(201).send();
});

app.post("/sondaggio/:id",(req, res, next) => { 
        res.status(201).send();
});
