"use strict";

const mongoose = require("mongoose");
const cashflowSummarySchema = new mongoose.Schema({
  bank_name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  total_credit: {
    type: Number,
    default: 0
  },
  total_debit: {
    type: Number,
    default: 0
  },
  net_cashflow: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("CashflowSummary", cashflowSummarySchema);