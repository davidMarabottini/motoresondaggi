-- user per il database

create user 'david'@'localhost' IDENTIFIED BY 'davidpass';

-- sondaggio database
-- 4 tabelle

-- sondaggio (id, nome, descrizione)
-- domanda (id, id_sondaggio, testo)
-- user (id, email)
-- risposta (id, id_domanda, id_user, valore)

create database sondaggio;

GRANT ALL PRIVILEGES ON sondaggio.* TO 'david'@'localhost';

use sondaggio;

create table sondaggio (id int primary key auto_increment, nome varchar(255) not null, descrizione varchar(1024));
create table domanda (id int primary key auto_increment, id_sondaggio int, testo varchar(1024), foreign key (id_sondaggio) references sondaggio(id) on delete cascade);
create table user (id int primary key auto_increment, email varchar(254) not null unique);
create table risposta (id int primary key auto_increment, id_domanda int references domanda(id), id_user int references user(id), valore boolean);
