const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/branches", (req, res) => {
  try {
    const branches = db.prepare("SELECT branch_id, branch_name FROM LIBRARY_BRANCH ORDER BY branch_id").all();
    res.json(branches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
