const express = require("express");
const router = express.Router();
const Transaction = require("../../models/Cashflow/Transaction");

router.post("/batch", async (req, res) => {
  try {
    const { transactions } = req.body;
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res
        .status(400)
        .json({ error: "transactions must be a non-empty array" });
    }

    // Normalize and validate minimal
    const docs = transactions.map((t) => ({
      bank_name: t.bank_name,
      account_number: t.account_number,
      date: new Date(t.date),
      description: t.description || "",
      balance: Number(t.balance),
      amount: Number(t.amount),
      type: t.type === "credit" ? "credit" : "debit",
    }));

    const inserted = await Transaction.insertMany(docs, { ordered: false });

    return res.json({
      transactions: inserted,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Server error", details: err.message });
  }
});

// GET transactions (filter)
router.get("/", async (req, res) => {
  try {
    const { start, end, bank_name, limit = 500 } = req.query;
    const q = {};
    if (bank_name) q.bank_name = bank_name;
    if (start || end) q.date = {};
    if (start) q.date.$gte = new Date(start);
    if (end) q.date.$lte = new Date(end);

    const txs = await Transaction.find(q)
      .sort({ date: 1 })
      .limit(Number(limit));
    return res.json({ transactions: txs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// GET lịch sử 30 ngày cho cùng tài khoản
router.get("/history/:accountNumber", async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const { limit = 500 } = req.query;

    if (!accountNumber) {
      return res.status(400).json({ error: "accountNumber is required" });
    }

    // Tính ngày cách đây 30 ngày
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const fromDate = new Date(Date.now() - THIRTY_DAYS_MS);

    const txs = await Transaction.find({
      account_number: accountNumber,
      date: { $gte: fromDate },
    })
      .sort({ date: -1 }) // mới nhất trước, thích thì đổi 1 cho tăng dần
      .limit(Number(limit));

    return res.json({ transactions: txs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});


module.exports = router;
