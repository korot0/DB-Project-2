const db = require("../db.js");
const express = require("express");

const router = express.Router();

const lateFeeExpression = `
	CASE
		WHEN BL.returned_date IS NULL AND BL.due_date < DATE('now')
			THEN (julianday(DATE('now')) - julianday(BL.due_date)) * 0.25
		WHEN BL.returned_date IS NOT NULL AND BL.returned_date > BL.due_date
			THEN (julianday(BL.returned_date) - julianday(BL.due_date)) * 0.25
		ELSE 0
	END
`;

router.get("/fees/borrower", (req, res) => {
	const card_no = req.query.card_no ?? "";
	const name = req.query.name ?? "";

	const conditions = [];
	const params = [];

		if (card_no) {
			conditions.push("B.card_no = ?");
			params.push(Number(card_no));
	}

	if (name) {
		conditions.push("B.name LIKE ?");
		params.push(`%${name}%`);
	}

	const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

	const rows = db
		.prepare(
			`
SELECT
	B.card_no,
	B.name,
	ROUND(COALESCE(SUM(${lateFeeExpression}), 0), 2) AS late_fee_balance
FROM BORROWER B
LEFT JOIN BOOK_LOANS BL ON BL.card_no = B.card_no
${whereClause}
GROUP BY B.card_no, B.name
ORDER BY late_fee_balance DESC, B.card_no;
`,
		)
		.all(...params);

	res.json(rows);
});

router.get("/fees/book", (req, res) => {
	const borrower_id = Number(req.query.card_no ?? req.query.borrower_id);
	const search = req.query.search ?? req.query.book ?? req.query.title ?? "";

if (!borrower_id) {
			return res.status(400).json({ error: "borrower id is required" });
		}

		const conditions = ["BL.card_no = ?"];
		const params = [borrower_id];

	if (search) {
		const numericSearch = Number(search);

		if (Number.isFinite(numericSearch) && String(numericSearch) === String(search).trim()) {
			conditions.push("B.book_id = ?");
			params.push(numericSearch);
		} else {
			conditions.push("B.title LIKE ?");
			params.push(`%${search}%`);
		}
	}

	const rows = db
		.prepare(
			`
SELECT
	BL.card_no,
	B.title AS book_title,
	BL.date_out,
	BL.due_date,
	ROUND(${lateFeeExpression}, 2) AS late_fee
FROM BOOK_LOANS BL
JOIN BOOK B ON B.book_id = BL.book_id
WHERE ${conditions.join(" AND ")}
ORDER BY BL.date_out DESC, B.title;
`,
		)
		.all(...params);

	res.json(rows);
});

module.exports = router;
