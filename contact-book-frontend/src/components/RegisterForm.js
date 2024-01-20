import React, { useState } from 'react';

const RegisterForm = ({ onRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // Zarejestrowano pomyślnie, wykonaj odpowiednie akcje
                onRegister();
            } else {
                const responseData = await response.json();
                if (response.status === 400 && responseData.error === 'Użytkownik o podanej nazwie już istnieje') {
                    alert('Użytkownik o podanej nazwie już istnieje');
                } else {
                    console.error('Błąd rejestracji');
                }
            }
        } catch (error) {
            console.error('Błąd rejestracji:', error);
        }

    };

    return (
        <div>
            <h2>Zarejestruj się</h2>
            <form onSubmit={handleRegister}>
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
                <button type="submit">Zarejestruj</button>
            </form>
        </div>
    );
};

export default RegisterForm;
