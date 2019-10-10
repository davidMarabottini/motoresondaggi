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

const insert = (sondaggio) =>{
	pool.getConnection((err,conn) => {
		if (err) {
			console.error("Errore nella get connection");
			throw err;
		}
		conn.beginTransaction((err) => {
			if(err){
				console.error("Errore inizio transazione");
				throw err;
			}
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
					let id = result.insertId;
					let domande = sondaggio.domande;
					l = domande.length;
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
						conn.commit((err) => {
							if (err) {
								conn.rollback((err) => {
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
	pool.getConnection((err,conn) => {
		if (err) {
			console.error("Errore nella get connection");
			throw err;
		}
		conn.beginTransaction((err) => {
			if(err){
				console.error("Errore inizio transazione");
				throw err;
			}
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
							result.domande = result_domande;
							res.json(result);
						}
					);
					
				}
			);
		});
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
