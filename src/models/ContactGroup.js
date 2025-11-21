class ContactGroup {
    constructor(db) {
        this.db = db;
    }

    create(contactId, groupId) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO ContactGroup (contact_id, group_id) VALUES (?, ?)';
            this.db.query(query, [contactId, groupId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    delete(contactId, groupId) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM ContactGroup WHERE contact_id = ? AND group_id = ?';
            this.db.query(query, [contactId, groupId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    getGroupsByContact(contactId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT g.id, g.name 
                FROM Group g 
                JOIN ContactGroup cg ON g.id = cg.group_id 
                WHERE cg.contact_id = ?`;
            this.db.query(query, [contactId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    getContactsByGroup(groupId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT c.id, c.name, c.email, c.phone 
                FROM Contact c 
                JOIN ContactGroup cg ON c.id = cg.contact_id 
                WHERE cg.group_id = ?`;
            this.db.query(query, [groupId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }
}

module.exports = ContactGroup;