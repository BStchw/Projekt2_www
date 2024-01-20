const bcrypt = require('bcrypt'); // Moduł do hashowania haseł
const jwt = require('jsonwebtoken'); // Moduł do obsługi tokenów JWT

const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

// Endpointy dla kontaktów
router.get('/contacts', (req, res) => {
    // Obsługa pobierania wszystkich kontaktów z bazy danych SQLite
    db.all('SELECT * FROM contacts', (err, rows) => {
        if (err) {
            console.error('Błąd pobierania kontaktów:', err.message);
            res.status(500).json({ error: 'Błąd pobierania kontaktów' });
        } else {
            res.json(rows);
        }
    });
});

router.post('/contacts', (req, res) => {
    // Obsługa dodawania nowego kontaktu do bazy danych SQLite
    const { name, surname, address, email, phone } = req.body;
    db.run('INSERT INTO contacts (name, surname, address, email, phone) VALUES (?, ?, ?, ?, ?)', [name, surname, address, email, phone], function (err) {
        if (err) {
            console.error('Błąd dodawania kontaktu:', err.message);
            res.status(500).json({ error: 'Błąd dodawania kontaktu' });
        } else {
            res.json({ id: this.lastID, name, surname, address, email, phone });
        }
    });
});

router.patch('/contacts/:id', (req, res) => {
    const contactId = req.params.id;
    const { name, surname, address, email, phone } = req.body;

    // Aktualizacja kontaktu w bazie danych
    db.run('UPDATE contacts SET name = ?, surname = ?, address = ?, email = ?, phone = ? WHERE id = ?', [name, surname, address, email, phone, contactId], function (err) {
        if (err) {
            console.error('Błąd aktualizacji kontaktu:', err.message);
            res.status(500).json({ error: 'Błąd aktualizacji kontaktu' });
        } else {
            // Pobierz zaktualizowany kontakt i zwróć go w odpowiedzi
            db.get('SELECT * FROM contacts WHERE id = ?', [contactId], (err, row) => {
                if (err) {
                    console.error('Błąd pobierania zaktualizowanego kontaktu:', err.message);
                    res.status(500).json({ error: 'Błąd pobierania zaktualizowanego kontaktu' });
                } else {
                    res.json(row);
                }
            });
        }
    });
});

// Usunięcie kontaktu
router.delete('/contacts/:id', (req, res) => {
    const contactId = req.params.id;

    // Usunięcie kontaktu z bazy danych
    db.run('DELETE FROM contacts WHERE id = ?', [contactId], function (err) {
        if (err) {
            console.error('Błąd usuwania kontaktu:', err.message);
            res.status(500).json({ error: 'Błąd usuwania kontaktu' });
        } else {
            res.json({ message: 'Kontakt został usunięty' });
        }
    });
});

// Endpoint do logowania
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Sprawdzenie, czy użytkownik istnieje
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            console.error('Błąd podczas logowania:', err.message);
            res.status(500).json({ error: 'Błąd logowania' });
        } else if (!user) {
            console.log('Nieprawidłowa nazwa użytkownika lub hasło');
            res.status(401).json({ error: 'Nieprawidłowa nazwa użytkownika lub hasło' });
        } else {
            // Sprawdzenie hasła
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                // Utworzenie tokena JWT
                const token = jwt.sign({ userId: user.id, username: user.username }, 'super-tajny-sekret', { expiresIn: '1h' });
                res.json({ token });
            } else {
                res.status(401).json({ error: 'Nieprawidłowa nazwa użytkownika lub hasło' });
            }
        }
    });
});

// Endpoint do rejestracji
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Sprawdzenie, czy użytkownik o podanej nazwie już istnieje
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, existingUser) => {
        if (err) {
            console.error('Błąd podczas rejestracji:', err.message);
            res.status(500).json({ error: 'Błąd rejestracji' });
        } else if (existingUser) {
            console.log('Użytkownik o podanej nazwie już istnieje');
            res.status(400).json({ error: 'Użytkownik o podanej nazwie już istnieje' });
        } else {
            // Haszowanie hasła przed zapisaniem do bazy danych
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);


            // Dodanie nowego użytkownika do bazy danych
            db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function (err) {
                if (err) {
                    console.error('Błąd rejestracji:', err.message);
                    res.status(500).json({ error: 'Błąd rejestracji' });
                } else {
                    console.log('Rejestracja zakończona sukcesem');
                    res.json({ message: 'Rejestracja zakończona sukcesem' });
                }
            });

            db.all('SELECT * FROM users', (err, rows) => {
                if (err) {
                    console.error(err.message);
                    return;
                }

                console.log(rows);
            });
        }
    });
});

module.exports = router;
