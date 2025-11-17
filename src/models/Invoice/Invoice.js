const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    customer_name: {
      type: String,
    },
    description: {
      type: String,
    },
    due_date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "OVERDUE"],
      default: "PENDING",
    },
    email_customer: {
      type: String,
    },
    paid_date: {
      type: Date,
    },
    bank_name: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Invoice", InvoiceSchema);
