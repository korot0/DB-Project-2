const db = require("../db.js");
const express = require("express");

const router = express.Router();

// GET /api/fees/borrower - List borrowers with total late fee balance
// Searchable by borrower ID, name, or part of name. No filters returns all ordered by balance.
router.get("/fees/borrower", (req, res) => {
	const card_no = req.query.card_no ?? "";
	const name = req.query.name ?? "";

	const conditions = [];
	const params = [];

	if (card_no) {
		conditions.push('"Card_No" = ?');
		params.push(Number(card_no));
	}

	if (name) {
		conditions.push('"Borrower Name" LIKE ?');
		params.push(`%${name}%`);
	}

	const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

	const rows = db
		.prepare(
			`
            SELECT
				"Card_No" AS borrower_id,
				"Borrower Name" AS borrower_name,
				printf('$%.2f', COALESCE(SUM(LateFeeBalance), 0)) AS late_fee_balance
            FROM vBookLoanInfo
            ${whereClause}
            GROUP BY "Card_No", "Borrower Name"
            ORDER BY COALESCE(SUM(LateFeeBalance), 0) DESC, "Card_No";
            `,
		)
		.all(...params);

	res.json(rows);
});

// GET /api/fees/book - List books with late fees for a borrower
// Requires borrower ID. Optional search by book ID, title, or part of title.
// No filters returns all ordered by highest late fee.
router.get("/fees/book", (req, res) => {
	const borrower_id = Number(req.query.card_no ?? req.query.borrower_id);
	const search = req.query.search ?? req.query.book ?? req.query.title ?? "";

	if (!borrower_id) {
		return res.status(400).json({ error: "borrower_id (card_no) is required" });
	}

	const conditions = ['"Card_No" = ?'];
	const params = [borrower_id];

	if (search) {
		const numericSearch = Number(search);

		if (Number.isFinite(numericSearch) && String(numericSearch) === String(search).trim()) {
			// Search by book_id (numeric)
			conditions.push("book_id = ?");
			params.push(numericSearch);
		} else {
			// Search by book title (text)
			conditions.push('"Book Title" LIKE ?');
			params.push(`%${search}%`);
		}
	}

	const rows = db
		.prepare(
			`
SELECT
	"Card_No" AS borrower_id,
	"Book Title" AS book_title,
	"Date_Out" AS date_out,
	"Due_Date" AS due_date,
	"Number of days returned late" AS days_late,
	CASE
		WHEN LateFeeBalance IS NULL OR LateFeeBalance <= 0 THEN 'Non-Applicable'
		ELSE printf('$%.2f', LateFeeBalance)
	END AS late_fee
FROM vBookLoanInfo
WHERE ${conditions.join(" AND ")}
ORDER BY COALESCE(LateFeeBalance, 0) DESC, "Date_Out" DESC;
`,
		)
		.all(...params);

	res.json(rows);
});

module.exports = router;
