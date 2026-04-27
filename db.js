const Database = require("better-sqlite3");
const db = new Database("library.db");

module.exports = db;

// Testing db
// const query = db.prepare("select * from borrower where name = ?");
// const row = query.get("Alex Kim");
