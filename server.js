const path = require("path");
const express = require("express");
const cors = require("cors");

const bookRouter = require("./routes/book");
const copiesRouter = require("./routes/copies");
const checkoutRouter = require("./routes/checkout");
const feesRouter = require("./routes/fees");
const lateRouter = require("./routes/late");
const borrowerRouter = require("./routes/borrower.js");
const branchesRouter = require("./routes/branches");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", bookRouter);
app.use("/api", copiesRouter);
app.use("/api", checkoutRouter);
app.use("/api", feesRouter);
app.use("/api", lateRouter);
app.use("/api", borrowerRouter);
app.use("/api", branchesRouter);

app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
