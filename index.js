const express = require("express");
const bodyParser = require("body-parser");
const ModelF = require("./app/model");
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let model = new ModelF();
app.listen(3000, () =>{
	console.log("Server is running on port 3000");
});

app.post("/sondaggio",(req, res, next) => {
	model.insertSondaggio(req.body);
	res.status(201).send();
});

app.get("/sondaggio/:sondaggioId",(req, res, next) => {
	model.getSondaggio(req, res, next);
});

app.post("/user",(req, res, next) => {
    model.insertUser(req.body.email);
    res.status(201).send();
});

app.get("/user/:userId",(req, res, next) => {
    model.getUser(req, res, next);
});

app.post("/sondaggio/:userId",(req, res, next) => { 
    model.insertResult(req, res, next)
    res.status(201).send();
});

app.get("/risposteSondaggio/:sondaggioId",(req, res, next) => {
    model.getRisposteSondaggio(req, res, next);
    res.status(201).send();
})