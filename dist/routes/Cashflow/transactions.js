"use strict";

const express = require("express");
const router = express.Router();
const Transaction = require("../../models/Cashflow/Transaction");
router.post("/batch", async (req, res) => {
  try {
    const {
      transactions
    } = req.body;
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({
        error: "transactions must be a non-empty array"
      });
    }

    // Normalize and validate minimal
    const docs = transactions.map(t => ({
      bank_name: t.bank_name,
      date: new Date(t.date),
      description: t.description || "",
      balance: Number(t.balance),
      amount: Number(t.amount),
      type: t.type === "credit" ? "credit" : "debit",
      balance_after: t.balance_after != null ? Number(t.balance_after) : undefined
    }));
    const inserted = await Transaction.insertMany(docs, {
      ordered: false
    });
    return res.json({
      transactions: inserted
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
});

// GET transactions (filter)
router.get("/", async (req, res) => {
  try {
    const {
      start,
      end,
      bank_name,
      limit = 500
    } = req.query;
    const q = {};
    if (bank_name) q.bank_name = bank_name;
    if (start || end) q.date = {};
    if (start) q.date.$gte = new Date(start);
    if (end) q.date.$lte = new Date(end);
    const txs = await Transaction.find(q).sort({
      date: 1
    }).limit(Number(limit));
    return res.json({
      transactions: txs
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message
    });
  }
});
module.exports = router;