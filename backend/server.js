const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('database.db', err => {
    if (err) {
        console.error('Błąd połączenia z bazą danych:', err.message);
    } else {
        console.log('Połączono z bazą danych SQLite');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        surname TEXT,
        address TEXT,
        email TEXT,
        phone TEXT
    )`);

db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        password TEXT
    )`);

app.get('/', (req, res) => {
    res.send('Serwer książki adresowej jest aktywny!');
});

const routes = require('./routes');
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});
