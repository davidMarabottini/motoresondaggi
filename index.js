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
			//ToDo: Controllare se req.params.sondaggioId è il metodo miglore per ritrovare l'id del sondaggio o ne esiste un altro
			console.info('la mia richiesta è ',req.params.sondaggioId);
			console.info("Recupero sondaggio");
			
			conn.query(
				'SELECT * FROM sondaggio s LEFT OUTER JOIN domanda d ON s.id = d.id_sondaggio  WHERE s.id=? order by d.id', 
				[req.params.sondaggioId], 
				function(err, result) {
					if(err){
						console.error('Errore nel recupero del sondaggio');
						throw err;
					}
					// ToDo: capire come gestire in modo ottimale la trasformazione del risultato in json
					console.info('miorisultato',result,'/miorisultato');
					result = JSON.parse(JSON.stringify(result));
					console.info('il mio risultato è ',result);
					myjson = {
						"id": result[0].sondaggio,
						"titolo": result[0].nome,
						"descrizione": result[0].descrizione,
					}
					const l=result.length;
					const domande = [];
					console.info(result);
					for(i=0; i < l; i++){
						domande.push({"id":result[i].id,"testo":result[i].testo})
					}
					myjson.domande = domande;
					res.json(myjson);
				}
			);
			
			// ToDo: Testare questo modo di fare, e capire se esiste un modo ancora migliore per gestire il tutto
			/*
			conn.query(
				'SELECT id, nome as titolo, descrizione FROM sondaggio s WHERE s.id=?',
				req.params.sondaggioId, 
				function(err, result) {
					if(err){
						console.error('Errore nel recupero del sondaggio', err);
						throw err;
					}
					// ToDo: capire come gestire in modo ottimale la trasformazione del risultato in json
					result = JSON.parse(JSON.stringify(result));
					console.info('il mio risultato è ',result);
					conn.query(
						'SELECT id, testo FROM domanda WHERE id_sondaggio=? ORDER BY id',
						req.params.sondaggioId,
						function(err, result_domande){
							if(err){
								console.error('Errorre nel recupero delle domande del sondaggio', err);
								throw err;
							}
							// ToDo: capire come gestire in modo ottimale la trasformazione del risultato in json
							result_domande = JSON.parse(JSON.stringify(result_domande))
							result.domande = result_domande;
						}
					);
					res.json(result);
				}
			);
			*/
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