const db = require("../config/database");

class ContactModel {
    async create(data) {
        const conn = await db();

        const [rows] = await conn.query(
            "INSERT INTO contacts (name, phone, email, company, groups_list) VALUES (?, ?, ?, ?, ?)",
            [
                data.name,
                data.phone,
                data.email,
                data.company,
                JSON.stringify(data.groups) // save array as JSON
            ]
        );

        return { id: rows.insertId, ...data };
    }

    async getAll() {
        const conn = await db();

        const [rows] = await conn.query("SELECT * FROM contacts");

        return rows.map(row => ({
            ...row,
            groups: row.groups_list ? JSON.parse(row.groups_list) : []
        }));
    }

    async update(id, data) {
        const conn = await db();

        await conn.query(
            "UPDATE contacts SET name=?, phone=?, email=?, company=?, groups_list=? WHERE id=?",
            [
                data.name,
                data.phone,
                data.email,
                data.company,
                JSON.stringify(data.groups),
                id
            ]
        );

        return { id, ...data };
    }

    async delete(id) {
        const conn = await db();
        await conn.query("DELETE FROM contacts WHERE id=?", [id]);
        return true;
    }
}

module.exports = ContactModel;
