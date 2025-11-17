const express = require("express");
const router = express.Router();
const Invoice = require("../../models/Invoice/Invoice");

// POST /api/invoices/batch
router.post("/batch", async (req, res) => {
  try {
    const { invoices } = req.body;

    if (!Array.isArray(invoices) || invoices.length === 0) {
      return res
        .status(400)
        .json({ error: "invoices must be a non-empty array" });
    }

    // Normalize & minimal validate giống style Transaction
    const docs = invoices.map((inv) => ({
      code: inv.code, // bắt buộc theo schema
      customer_name: inv.customer_name, // bắt buộc
      description: inv.description || "",
      due_date: new Date(inv.due_date), // bắt buộc
      amount: Number(inv.amount), // bắt buộc
      status: inv.status || "PENDING", // PENDING / PAID / OVERDUE
      email_customer: inv.email_customer,
      paid_date: inv.paid_date ? new Date(inv.paid_date) : undefined,
      bank_name: inv.bank_name,
    }));

    const inserted = await Invoice.insertMany(docs, { ordered: false });

    return res.json({
      invoices: inserted,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Server error", details: err.message });
  }
});

// GET /api/invoices
// Lấy danh sách invoice (có filter nhẹ)
router.get("/", async (req, res) => {
  try {
    const {
      start, // filter theo due_date từ ngày...
      end,   // ...đến ngày
      customer_name,
      status,
      bank_name,
      limit = 500,
    } = req.query;

    const q = {};

    if (customer_name) q.customer_name = customer_name;
    if (status) q.status = status;
    if (bank_name) q.bank_name = bank_name;

    if (start || end) q.due_date = {};
    if (start) q.due_date.$gte = new Date(start);
    if (end) q.due_date.$lte = new Date(end);

    const invoices = await Invoice.find(q)
      .sort({ due_date: 1 }) // để dashboard dễ chia overdue / upcoming
      .limit(Number(limit));

    return res.json({ invoices });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// PATCH /api/invoices/:code/pay
router.patch("/:code/pay", async (req, res) => {
  try {
    const { code } = req.params;
    const { paid_date, bank_name, amount } = req.body;

    // build object update
    const update = {
      status: "PAID",
      paid_date: paid_date ? new Date(paid_date) : new Date(),
    };

    if (bank_name) update.bank_name = bank_name;
    if (amount != null) update.amount = Number(amount);

    const invoice = await Invoice.findOneAndUpdate(
      { code },
      update,
      { new: true } // trả về document sau update
    );

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    return res.json({ invoice });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
