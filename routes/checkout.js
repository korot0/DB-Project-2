const db = require("../db.js");
const express = require("express");

const router = express.Router();

router.post("/checkout", (req, res) => {
    const card_no = Number(req.body.card_no);
    const book_id = Number(req.body.book_id);
    const branch_id = Number(req.body.branch_id);
    const date_out = req.body.date_out;
    const due_date = req.body.due_date;
    if (!card_no || !book_id || !branch_id || !date_out || !due_date) {
        return res.status(400).json({error: "card_no, book_id, branch_id, date_out, and due_date are required"});
    }

	try {
		db.prepare(
			`INSERT INTO BOOK_LOANS (book_id, branch_id, card_no, date_out, due_date, Late)
			 VALUES (?, ?, ?, ?, ?, 0)`,
		).run(book_id, branch_id, card_no, date_out, due_date);

		const updatedCopies = db
			.prepare(
				`SELECT book_id, branch_id, no_of_copies
                 FROM BOOK_COPIES
                 WHERE book_id = ? AND branch_id = ?`,
			)
			.get(book_id, branch_id);

		return res.status(201).json(updatedCopies);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

module.exports = router;
