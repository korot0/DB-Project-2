const Database = require("better-sqlite3");
const db = new Database("library.db");

db.pragma("foreign_keys = ON");

db.exec(`
CREATE TRIGGER IF NOT EXISTS checkout_book_copy
AFTER INSERT ON BOOK_LOANS
BEGIN
		UPDATE BOOK_COPIES
		SET no_of_copies = no_of_copies - 1
		WHERE book_id = NEW.book_id
			AND branch_id = NEW.branch_id;
END;
`);

module.exports = db;
