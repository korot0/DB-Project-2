const db = require("../db.js");
const express = require("express");

const bookRouter = express.Router();

bookRouter.post("/book", (req, res) => {
  const title = req.query.title;
  const isbn = req.query.isbn;
  const authorFirst = req.query.authorFirst;
  const authoerLast = req.query.authorLast;
  const publisher = req.query.publisher;
});

module.exports = bookRouter;
