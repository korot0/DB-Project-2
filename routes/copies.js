const db = require("../db.js");
const express = require("express");

const copiesRouter = express.Router();

copiesRouter.get("/copies", (req, res) => {
  const title = req.query.title;

  const rows = db
    .prepare(
      ` 
SELECT LB.branch_id, LB.branch_name, COUNT(*) AS loaned_out
FROM BOOK_LOANS BL
JOIN BOOK B ON B.book_id = BL.book_id
JOIN LIBRARY_BRANCH LB ON LB.branch_id = BL.branch_id
WHERE B.title = ?
GROUP BY LB.branch_id;
`,
    )
    .all(title);

  res.json(rows);
});

module.exports = copiesRouter;
