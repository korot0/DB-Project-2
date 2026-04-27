const db = require("../db.js");
const express = require("express");

const router = express.Router();

// Returns loans that were returned late within a due-date range.
// Query params: ?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/late", (req, res) => {
	const from = req.query.from ?? req.query.dueFrom;
	const to = req.query.to ?? req.query.dueTo;

	if (!from || !to) {
		return res.status(400).json({ error: "from and to dates are required" });
	}

	const sql = `
SELECT
  BL.card_no,
  B.book_id,
  B.title AS book_title,
  BL.date_out,
  BL.due_date,
  BL.returned_date,
  CAST(julianday(BL.returned_date) - julianday(BL.due_date) AS INTEGER) AS days_late
FROM BOOK_LOANS BL
JOIN BOOK B ON B.book_id = BL.book_id
WHERE BL.due_date BETWEEN ? AND ?
  AND BL.returned_date IS NOT NULL
  AND BL.returned_date > BL.due_date
ORDER BY days_late DESC, BL.due_date;
`;

	try {
		const rows = db.prepare(sql).all(from, to);
		const out = rows.map((r) => ({ ...r, days_late: Math.max(0, r.days_late) }));
		return res.json(out);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

module.exports = router;
