const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    bank_name: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    balance: { type: Number },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    balance_after: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
