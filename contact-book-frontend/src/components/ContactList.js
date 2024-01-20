import React, { useEffect, useState } from 'react';
import EditContactForm from './EditContactForm';
import './ContactList.css';

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [editingContact, setEditingContact] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [originalContacts, setOriginalContacts] = useState([]);

    const fetchContacts = async () => {
        try {
            const response = await fetch('http://localhost:3000/contacts');
            const data = await response.json();
            setContacts(data);
            setOriginalContacts(data);
        } catch (error) {
            console.error('Błąd podczas pobierania kontaktów:', error);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleEdit = (id) => {
        const contactToEdit = contacts.find(contact => contact.id === id);
        setEditingContact(contactToEdit);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setEditingContact(null);
        setIsEditing(false);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/contacts/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchContacts();
                setEditingContact(null);
                setIsEditing(false);
            } else {
                console.error('Błąd podczas usuwania kontaktu');
            }
        } catch (error) {
            console.error('Błąd podczas usuwania kontaktu:', error);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        const filtered = originalContacts.filter(contact =>
            contact.name.toLowerCase().includes(term.toLowerCase()) ||
            contact.surname.toLowerCase().includes(term.toLowerCase()) ||
            contact.address.toLowerCase().includes(term.toLowerCase()) ||
            contact.email.toLowerCase().includes(term.toLowerCase()) ||
            contact.phone.toLowerCase().includes(term.toLowerCase())
        );

        setContacts(filtered);
    };

    return (
        <div>
            <h2>Lista Kontaktów</h2>
            <input
                type="text"
                placeholder="Wyszukaj kontakt"
                value={searchTerm}
                onChange={handleSearch}
            />
            {isEditing ? (
                <EditContactForm
                    contact={editingContact}
                    onCancel={handleCancelEdit}
                    onEdit={() => {
                        fetchContacts();
                        setEditingContact(null);
                        setIsEditing(false);
                    }}
                />
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Imię</th>
                        <th>Nazwisko</th>
                        <th>Adres</th>
                        <th>Email</th>
                        <th>Telefon</th>
                        <th>Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {contacts.map(contact => (
                        <tr key={contact.id}>
                            <td>{contact.name}</td>
                            <td>{contact.surname}</td>
                            <td>{contact.address}</td>
                            <td>{contact.email}</td>
                            <td>{contact.phone}</td>
                            <td>
                                <button onClick={() => handleEdit(contact.id)}>Edytuj</button>
                                <button onClick={() => handleDelete(contact.id)}>Usuń</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ContactList;