"use strict";

const mongoose = require("mongoose");
const ExpenseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  // mô tả chi tiêu
  date: {
    type: Date,
    required: true
  } // ngày chi tiêu
});
module.exports = mongoose.model("Expense", ExpenseSchema);