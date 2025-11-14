const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  spent: { type: Number, required: true },
  budget: { type: Number, required: true },
  percent: { type: Number, required: true }
}, { _id: false });

const reportSchema = new mongoose.Schema({
  totalSpent: { type: Number, required: true },
  totalBudget: { type: Number, required: true },
  percentUsed: { type: Number, required: true },
  categories: [categorySchema]
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
