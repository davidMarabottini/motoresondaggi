const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'david',
    password : 'davidpass',
    database : 'sondaggio',
    debug    :  true
});

function insert(sondaggio) {
	pool.getConnection(function(err,conn){
		if (err) {
			console.error("Errore nella get connection");
			throw err;
		}
		conn.beginTransaction(function(err){
			if(err){
				console.error("Errore inizio transazione");
				throw err;
			}
			console.info("Inserimento sondaggio");
			conn.query(
				'INSERT INTO sondaggio(nome,descrizione) values(?,?)', 
				[sondaggio.nome, sondaggio.descrizione], 
				function(err, result) {
					if (err) { 
						conn.rollback(function() {
							console.error("Rollback in seguito a errore inserimento sondaggio");
							throw err;
						});
					}
					console.info("Inserimento domande sondaggio");
					let id = result.insertId;
					let domande = sondaggio.domande;
					l = domande.length;
					for(let i = 0; i < l; i++) {
						conn.query(
							'INSERT INTO domanda(id_sondaggio, testo) values(?,?)', 
							[id, domande[i]],
							function(err, result) {
								if (err) { 
									conn.rollback(function() {
										console.error("Rollback in serguito a errore inserimento domanda");
								  		throw err;
									});
								}
							}
						);
						conn.commit(function(err){
							if (err) {
								conn.rollback(function(err){
									throw err;
								});
							}
						});
					}
				}
			);
		});
	});
}

app.listen(3000, () =>{
	console.log("Server is running on port 3000");
});

app.get("/sondaggio/:sondaggioId",(req, res, next) => {
	res.json({
		"titolo": "Sondaggio di test",
		"descrizione": "Primo sondaggio",
		"id":1,
		"domande":[
			{"id":1,"testo":"Domanda 1"},
			{"id":2,"testo":"Domanda 2"}
		]
	});
});

app.post("/sondaggio",(req, res, next) => {
	console.info("Ricevuto payload POST");
	console.info(req.body);
	console.info("Inserimento sondaggio");
	insert(req.body);
	res.status(201).send();
});

app.post("/sondaggio/:id",(req, res, next) => { 
        res.status(201).send();
});