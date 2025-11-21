const mysql = require("mysql2/promise");

let connection;

async function connectDB() {
    if (!connection) {
        connection = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "prashant",
            database: "address_book"
        });
        console.log("MySQL Connected Successfully!");
    }
    return connection;
}

module.exports = connectDB;
