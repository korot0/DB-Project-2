// 3) Add a new Book with publisher (use can use a publisher that already exists) and author information to all 5 branches with 5 copies for each branch.

const db = require("../db.js");
const express = require("express");

const bookRouter = express.Router();

bookRouter.post("/book", (req, res) => {
  const { title, authorName, publisher } = req.body;

  const insertBook = db.prepare(
    `insert into book (title, publisher_name) values (?, ?);`,
  );

  const insertAuthor = db.prepare(
    `insert into book_authors (book_id, author_name) values(?, ?);`,
  );

  const insertCopies = db.prepare(
    `insert into book_copies(book_id, branch_id, no_of_copies) values (?, ?, ?);`,
  );

  const getBranches = db.prepare(`select branch_id from library_branch;`);

  const transaction = db.transaction(() => {
    const bookResult = insertBook.run(title, publisher);
    const bookId = bookResult.lastInsertRowid;

    insertAuthor.run(bookId, authorName);

    const branches = getBranches.all();

    for (const branch of branches) {
      insertCopies.run(bookId, branch.branch_id, 5);
    }

    return bookId;
  });

  try {
    const bookId = transaction();

    res.json({
      message: "Book created",
      book_id: bookId,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create a book" });
  }
});

module.exports = bookRouter;
