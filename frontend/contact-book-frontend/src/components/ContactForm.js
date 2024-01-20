import React, { useState } from 'react';

const ContactForm = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, surname, address, email, phone }),
            });

            const data = await response.json();
            console.log('Dodano kontakt:', data);

            // Zeruj pola formularza po dodaniu kontaktu
            setName('');
            setSurname('');
            setAddress('');
            setEmail('');
            setPhone('');

        } catch (error) {
            console.error('Błąd podczas dodawania kontaktu:', error);
        }
    };

    return (
        <div>
            <h2>Dodaj Nowy Kontakt</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Imię:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <br />
                <label>
                    Nazwisko:
                    <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
                </label>
                <br />
                <label>
                    Adres:
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                </label>
                <br />
                <label>
                    e-mail:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <br />
                <label>
                    Telefon:
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </label>
                <br />
                <button type="submit">Dodaj Kontakt</button>
            </form>
        </div>
    );
};

export default ContactForm;
