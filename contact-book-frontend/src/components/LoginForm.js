import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = ({ onLogin, onRegisterClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const { token } = await response.json();
                onLogin(token);
            } else {
                console.error('Błąd logowania');
            }
        } catch (error) {
            console.error('Błąd logowania:', error);
        }
    };

    return (
        <div>
            <h2>Zaloguj się</h2>
            <form onSubmit={handleLogin}>
                <label>
                    Nazwa użytkownika:
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <br />
                <label>
                    Hasło:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <br />
                <button type="submit">Zaloguj</button>
                <br />
                <span>Nie masz konta? <button type="button" onClick={onRegisterClick}>Zarejestruj się</button></span>
            </form>
        </div>
    );
};

export default LoginForm;
