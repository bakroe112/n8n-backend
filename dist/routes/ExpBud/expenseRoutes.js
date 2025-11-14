"use strict";

const express = require("express");
const router = express.Router();
const Expense = require("../../models/ExpBud/Expense");

// Create one or many expenses
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    let result;
    if (Array.isArray(data)) {
      // Nếu body là array => insert nhiều
      result = await Expense.insertMany(data);
    } else {
      // Nếu body là object => insert 1
      const expense = new Expense(data);
      result = await expense.save();
    }
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
});

// Read all
router.get("/", async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

// GET /api/expenses/years 
router.get("/years", async (req, res) => {
  try {
    const years = await Expense.aggregate([{
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

// GET /api/expenses/:year/:month
router.get("/:year/:month", async (req, res) => {
  try {
    const {
      year,
      month
    } = req.params;

    // Tạo khoảng ngày [đầu tháng, đầu tháng tiếp theo)
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    const expenses = await Expense.find({
      date: {
        $gte: startDate,
        $lt: endDate
      }
    }).sort({
      date: 1
    }); // sắp xếp theo ngày tăng dần

    res.json(expenses);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Read one
router.get("/:id", async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).json({
    error: "Not found"
  });
  res.json(expense);
});

// Update
router.put("/:id", async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!expense) return res.status(404).json({
    error: "Not found"
  });
  res.json(expense);
});

// Delete
router.delete("/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({
    message: "Deleted"
  });
});
module.exports = router;