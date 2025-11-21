// This file contains functions for managing contacts on the frontend, including adding, editing, and deleting contacts, as well as displaying them in the UI.

const apiUrl = '/api/contacts';

async function fetchContacts() {
    const response = await fetch(apiUrl);
    const contacts = await response.json();
    displayContacts(contacts);
}

function displayContacts(contacts) {
    const contactList = document.getElementById('contact-list');
    contactList.innerHTML = '';

    contacts.forEach(contact => {
        const contactItem = document.createElement('div');
        contactItem.className = 'contact-item';
        contactItem.innerHTML = `
            <h3>${contact.name}</h3>
            <p>Email: ${contact.email}</p>
            <p>Phone: ${contact.phone}</p>
            <button onclick="editContact(${contact.id})">Edit</button>
            <button onclick="deleteContact(${contact.id})">Delete</button>
        `;
        contactList.appendChild(contactItem);
    });
}

async function addContact(contact) {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
    });
    const newContact = await response.json();
    fetchContacts();
}

async function editContact(contactId) {
    const contact = prompt("Enter new contact details in JSON format (e.g., {\"name\": \"John Doe\", \"email\": \"john@example.com\", \"phone\": \"1234567890\"}):");
    if (contact) {
        const response = await fetch(`${apiUrl}/${contactId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: contact,
        });
        await response.json();
        fetchContacts();
    }
}

async function deleteContact(contactId) {
    await fetch(`${apiUrl}/${contactId}`, {
        method: 'DELETE',
    });
    fetchContacts();
}

// Initial fetch of contacts when the page loads
document.addEventListener('DOMContentLoaded', fetchContacts);