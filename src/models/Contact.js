class Contact {
    constructor(id, name, email, phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    static async create(connection, contactData) {
        const { name, email, phone } = contactData;
        const query = 'INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)';
        const [result] = await connection.execute(query, [name, email, phone]);
        return new Contact(result.insertId, name, email, phone);
    }

    static async getAll(connection) {
        const query = 'SELECT * FROM contacts';
        const [rows] = await connection.execute(query);
        return rows.map(row => new Contact(row.id, row.name, row.email, row.phone));
    }

    static async update(connection, id, contactData) {
        const { name, email, phone } = contactData;
        const query = 'UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?';
        await connection.execute(query, [name, email, phone, id]);
        return new Contact(id, name, email, phone);
    }

    static async delete(connection, id) {
        const query = 'DELETE FROM contacts WHERE id = ?';
        await connection.execute(query, [id]);
    }
}

export default Contact;