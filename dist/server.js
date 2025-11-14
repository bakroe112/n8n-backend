"use strict";

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
// Cashflow
const txRoutes = require("./routes/Cashflow/transactions");
const summaryRoutes = require("./routes/Cashflow/cashflowSummary");
// ExpBug
const expenseRoutes = require("./routes/ExpBud/expenseRoutes");
const budgetRoutes = require("./routes/ExpBud/budgetRoutes");
const reportRoutes = require("./routes/ExpBud/reportRoutes");
const app = express();
app.use(cors());
app.use(express.json({
  limit: "5mb"
}));
app.use(morgan("dev"));

// Cashflow
app.use("/api/transactions", txRoutes);
app.use("/api/summary", summaryRoutes);
// ExpBug
app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/reports", reportRoutes);
const PORT = process.env.PORT || 4000;
const db_URL = process.env.MONGO_URI;
mongoose.connect(db_URL);
const conn = mongoose.connection;
conn.once("open", () => {
  console.log("Mongo connected");
  app.listen(PORT, () => console.log("Server listening on", PORT));
});
conn.on("error", () => {
  console.error("Mongo connection error");
});