class Group {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static async createGroup(connection, name) {
        const query = 'INSERT INTO groups (name) VALUES (?)';
        const [result] = await connection.execute(query, [name]);
        return new Group(result.insertId, name);
    }

    static async getGroups(connection) {
        const query = 'SELECT * FROM groups';
        const [rows] = await connection.execute(query);
        return rows.map(row => new Group(row.id, row.name));
    }

    static async updateGroup(connection, id, name) {
        const query = 'UPDATE groups SET name = ? WHERE id = ?';
        await connection.execute(query, [name, id]);
        return new Group(id, name);
    }

    static async deleteGroup(connection, id) {
        const query = 'DELETE FROM groups WHERE id = ?';
        await connection.execute(query, [id]);
    }
}

export default Group;