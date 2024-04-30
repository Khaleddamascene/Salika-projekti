const express = require('express');
const mysql = require('mysql2');
const path = require("path");
const fs = require("fs");


const {port, host} = require('./config.json');
const dbconfig = require('./dbconfig.json');
const {get} = require('http');

const app = express();
app.use("/inc", express.static("includes"));
app.set('view engine', 'ejs');
app.set('view', path.join(__dirname, 'sivupohjat'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

function getElokuvat(res, kysely){
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
    connection.query(kysely,
    (err, rivit, kentat) => {
        if (err) {
            throw err;
        }

        let vastaus = '';
        for (let rivi of rivit){
            vastaus += `${rivi.actor_id} ${rivi.first_name} ${rivi.last_name} ${rivi.last_update}`;
        }
        res.send(vastaus)
    });
    connection.end();
}

app.get('/elokuvat', (req, res) => {
    const kysely = `SELECT * FROM actor`;
    getElokuvat(res, kysely);
});

app.listen(port, host, () => {console.log('Sakilapalvelin kuuntelee.......')})



/*

// luodaan Express-sovellus
const app = express();

// otetaan JSON-datan käsittely käyttöön
app.use(express.json());

app.get('/', (req, res) => {
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
    let kysely = "SELECT etunimi, sukunimi, yritys, kaupunki FROM tyontekija ORDER BY sukunimi, etunimi";
connection.query(kysely, (err, rivit, kentat) => {
            if (err) {
                throw err;
            }
            let vastaus = [];
            for(let rivi of rivit) {
                vastaus.push({
                    etunimi: rivi.etunimi,
                    sukunimi: rivi.sukunimi,
                    yritys: rivi.yritys,
                    kaupunki: rivi.kaupunki
                });
            }
            res.json(vastaus);
        });
    connection.end();
});

app.post('/uusi', (req, res) => {
    const id = req.body.id;
    const etunimi = req.body.etunimi;
    const sukunimi = req.body.sukunimi;
    const yritys = req.body.yritys;
    const kaupunki = req.body.kaupunki;
    console.log(etunimi)
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
    connection.query("INSERT INTO tyontekija (id, etunimi, sukunimi, yritys, kaupunki) VALUES (?, ?, ?, ?, ?)", [id, etunimi, sukunimi, yritys, kaupunki],
        (err, result) => {  
            if (err) {
                throw err;
            }
            res.send('Työntekijä lisätty');
        });
    connection.end();
});

app.listen(port, host, () => console.log(`${host}:${port} kuuntelee...`));






*/