const db = require("../db.js");
const express = require("express");

const copiesRouter = express.Router();

copiesRouter.get("/copies", (req, res) => {
  const title = req.query.title;

  const rows = db
    .prepare(
      ` 
      select lb.branch_id, lb.branch_name, count(*) as loaned_out
      from book_loans bl
      join book b on b.book_id = bl.book_id
      join library_branch lb on lb.branch_id = bl.branch_id
      where b.title = ?
      group by lb.branch_id;
`,
    )
    .all(title);

  res.json(rows);
});

module.exports = copiesRouter;
