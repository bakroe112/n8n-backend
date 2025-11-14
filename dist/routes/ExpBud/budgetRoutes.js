"use strict";

const express = require("express");
const router = express.Router();
const Budget = require("../../models/ExpBud/Budget");

// ==========================
// Create Budget
// ==========================
// Create one or many budgets
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    let result;
    if (Array.isArray(data)) {
      // Nếu body là array => insert nhiều budget
      const budgets = data.map(b => ({
        category: b.category,
        amount: b.amount,
        date: new Date(b.date)
      }));
      result = await Budget.insertMany(budgets);
    } else {
      // Nếu body là object => insert 1 budget
      const {
        category,
        amount,
        date
      } = data;
      if (!category || !amount || !date) {
        return res.status(400).json({
          error: "category, amount, date are required"
        });
      }
      const budget = new Budget({
        category,
        amount,
        date: new Date(date) // đảm bảo lưu dạng Date
      });
      result = await budget.save();
    }
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
});

// GET /api/budgets/years
router.get("/years", async (req, res) => {
  try {
    const years = await Budget.aggregate([{
      $project: {
        year: {
          $year: "$date"
        }
      }
    }, {
      $group: {
        _id: "$year"
      }
    }, {
      $sort: {
        _id: 1
      }
    }]);
    res.json(years.map(y => y._id));
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ==========================
// GET /api/budgets/:year/:month
router.get("/:year/:month", async (req, res) => {
  try {
    const {
      year,
      month
    } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    const budgets = await Budget.find({
      date: {
        $gte: startDate,
        $lt: endDate
      }
    }).sort({
      date: 1
    });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
router.get("/", async (req, res) => {
  const budgets = await Budget.find();
  res.json(budgets);
});

// ==========================
// Get One Budget by ID
// ==========================
router.get("/:id", async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({
      error: "Not found"
    });
    res.json(budget);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ==========================
// Update Budget
// ==========================
router.put("/:id", async (req, res) => {
  try {
    const {
      category,
      amount,
      date
    } = req.body;
    const budget = await Budget.findByIdAndUpdate(req.params.id, {
      category,
      amount,
      date: date ? new Date(date) : undefined
    }, {
      new: true,
      runValidators: true
    });
    if (!budget) return res.status(404).json({
      error: "Not found"
    });
    res.json(budget);
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
});

// ==========================
// Delete Budget
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Budget.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({
      error: "Not found"
    });
    res.json({
      message: "Deleted"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
module.exports = router;