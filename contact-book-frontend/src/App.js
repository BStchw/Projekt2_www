import React, { useState, useEffect } from 'react';
import './App.css';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const App = () => {
    const [token, setToken] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        if (token) {
            fetchContacts();
        }
    }, [token]);

    const fetchContacts = async () => {
        try {
            const response = await fetch('http://localhost:3000/contacts');
            const data = await response.json();
            setContacts(data);
        } catch (error) {
            console.error('Błąd podczas pobierania kontaktów:', error);
        }
    };

    const handleLogin = (newToken) => {
        setToken(newToken);
    };

    const handleRegisterClick = () => {
        setIsRegistering(true);
    };

    const handleRegister = async (userData) => {
        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                setIsRegistering(false);
                console.log('Rejestracja zakończona sukcesem');
            } else {
                console.error('Błąd rejestracji:', response.statusText);
            }
        } catch (error) {
            console.error('Błąd rejestracji:', error.message);
        }
    };

    const handleAddContact = async (contactData) => {
        try {
            const response = await fetch('http://localhost:3000/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactData),
            });

            if (response.ok) {
                console.log('Dodano kontakt:', response);

            } else {
                console.error('Błąd podczas dodawania kontaktu:', response.statusText);
            }
        } catch (error) {
            console.error('Błąd podczas dodawania kontaktu:', error.message);
        }
    };

    return (
        <div className="App">
            <h1>Książka Kontaktowa</h1>
            {!token ? (
                isRegistering ? (
                    <RegisterForm onRegister={handleRegister} />
                ) : (
                    <LoginForm onLogin={handleLogin} onRegisterClick={handleRegisterClick} />
                )
            ) : (
                <>
                    <ContactForm onAddContact={handleAddContact} />
                    <ContactList contacts={contacts} />
                </>
            )}
        </div>
    );
};

export default App;