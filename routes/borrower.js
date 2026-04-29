// 2) Add information about a new Borrower. Do not provide the CardNo in your query. Output the card number as if you are giving a new library card.

const db = require("../db.js");
const express = require("express");

const borrowerRouter = express.Router();

borrowerRouter.post("/borrower", (req, res) => {
  const { name, address, phone } = req.body;

  const insertBorrower = db.prepare(
    `insert into borrower (name, address, phone) values (?, ?, ?);`,
  );

  try {
    const insertResult = insertBorrower.run(name, address, phone);
    const cardNo = insertResult.lastInsertRowid;

    res.json({
      message: `Thank you, here is your card: ${cardNo}`,
      card_no: cardNo,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create a borrower" });
  }
});

module.exports = borrowerRouter;
