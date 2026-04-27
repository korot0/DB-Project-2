const Database = require("better-sqlite3");
const db = new Database("library.db");

// Testing db
const query = db.prepare("select * from borrower where name = ?");
const row = query.get("Alex Kim");
console.log(row);
