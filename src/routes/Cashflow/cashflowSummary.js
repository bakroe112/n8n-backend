const express = require("express");
const router = express.Router();
const CashflowSummary = require("../../models/Cashflow/CashflowSummary");

// POST /api/cashflow-summary
// body: { date, total_credit, total_debit, net_cashflow, predicted_balance }
router.post("/", async (req, res) => {
  try {
    const {
      bank_name,
      date,
      total_credit,
      total_debit,
      net_cashflow,
      balance,
    } = req.body;
    if (!date) return res.status(400).json({ error: "date is required" });

    const summary = new CashflowSummary({
      bank_name: new String(bank_name),
      date: new Date(date),
      total_credit: Number(total_credit || 0),
      total_debit: Number(total_debit || 0),
      net_cashflow: Number(net_cashflow || 0),
      balance: Number(balance || 0),
      created_at: new Date(),
    });

    await summary.save();
    return res.json({ success: true, summary });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// GET summaries (optional filter by date)
router.get("/", async (req, res) => {
  try {
    const { start, end, limit = 100 } = req.query;
    const q = {};
    if (start || end) q.date = {};
    if (start) q.date.$gte = new Date(start);
    if (end) q.date.$lte = new Date(end);

    const summaries = await CashflowSummary.find(q)
      .sort({ date: 1 })
      .limit(Number(limit));
    return res.json({ summaries });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
