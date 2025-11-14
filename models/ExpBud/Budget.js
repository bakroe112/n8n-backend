const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  category: { type: String, required: true },   // Danh mục
  amount: { type: Number, required: true },     // Số tiền ngân sách
  date: { type: Date, required: true },  

});



module.exports = mongoose.model("Budget", BudgetSchema);
