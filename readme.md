# Backend Node JS di Esempio

Un progetto di esempio per la gestione di sondaggi binari.

## Endpoint

### [GET] /sondaggio/:id

Un metodo per ritornare un sondaggio con l'id specificato. La risposta json ha il formato

```
{
    "id": 12345,
    "nome": "il nome del sondaggio",
    "descrizione": "la descrizione del sondaggio",
    "domande": [
        {
            "id": 1,
            "testo": "Testo domanda 1"
        },
        ...
    ]
}
```

### [POST] /sondaggio

Crea un nuovo sondaggio da un payload con il segurente formato:

```
{
    "nome": "il nome del sondaggio",
    "descrizione": "la descrizione del sondaggio",
    "domande": ["Testo domanda 1", ... ]
}
```

I sondaggi creati vengono salvati su un istanza mysql con le seguenti caratteristiche:

### [POST] /sondaggio/:id

Crea una risposta data dall'utente al sondaggio. Ci sono vari punti aperti ancora da gestire. Per ora è solo un semplice mock.

## Database

```
username: david
password: davidpass
host: localhost
```

Per creare il database, bisogna installare mysql e eseguire lo script `sondaggio.sql` che si trova nella root di questo progetto.

Lo script crea l'utente, il database e lo schema. Si può importare avviando un'istanza della shell mysql e successivamente scrivendo

```
source /path/to/file.sql
```

Il database ha 4 tabelle:

- sondaggio
- domanda
- user
- risposta

Si avvia il progetto semplicemente con

```
node start
```
