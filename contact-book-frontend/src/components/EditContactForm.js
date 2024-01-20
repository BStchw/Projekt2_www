// EditContactForm.js
import React, { useState, useEffect } from 'react';

const EditContactForm = ({ contact, onCancel, onEdit }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        console.log('Contact ID:', contact?.id);  // Dodaj ?. aby uniknąć błędów, jeśli contact jest null/undefined
        // Pobranie danych kontaktu do edycji po jego ID
        if (contact) {
            setName(contact.name || '');
            setSurname(contact.surname || '');
            setAddress(contact.address || '');
            setEmail(contact.email || '');
            setPhone(contact.phone || '');
        }
    }, [contact]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Wysyłanie żądania do backendu w celu aktualizacji kontaktu
            const response = await fetch(`http://localhost:3000/contacts/${contact.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, surname, address, email, phone }),
            });

            if (response.ok) {
                // Zatwierdzenie edycji
                onEdit();
            } else {
                console.error('Błąd podczas aktualizacji kontaktu');
            }
        } catch (error) {
            console.error('Błąd podczas aktualizacji kontaktu:', error);
        }
    };

    return (
        <div>
            <h2>Edytuj Kontakt</h2>
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
                <button type="submit">Zapisz zmiany</button>
                <button type="button" onClick={onCancel}>Anuluj</button>
            </form>
        </div>
    );
};

export default EditContactForm;
