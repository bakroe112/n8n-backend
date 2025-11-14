"use strict";

const express = require("express");
const router = express.Router();
const Report = require("../../models/ExpBud/Report"); // đường dẫn tới model Report.js

// POST /api/reports → lưu report mới
router.post("/", async (req, res) => {
  try {
    const {
      totalSpent,
      totalBudget,
      percentUsed,
      categories
    } = req.body;
    if (totalSpent === undefined || totalBudget === undefined || percentUsed === undefined || !Array.isArray(categories)) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ hoặc thiếu"
      });
    }

    // Tạo report mới theo đúng schema
    const newReport = new Report({
      totalSpent,
      totalBudget,
      percentUsed,
      categories
    });
    const savedReport = await newReport.save();
    res.status(201).json({
      message: "Lưu report thành công",
      report: savedReport
    });
  } catch (error) {
    console.error("Lỗi khi lưu report:", error);
    res.status(500).json({
      message: "Lỗi server",
      error: error.message
    });
  }
});

// GET /api/reports → lấy tất cả report, sắp xếp mới nhất
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find().sort({
      createdAt: -1
    });
    res.json(reports);
  } catch (error) {
    console.error("Lỗi khi lấy report:", error);
    res.status(500).json({
      message: "Lỗi server",
      error: error.message
    });
  }
});

// GET /api/reports/latest → lấy report mới nhất
router.get("/latest", async (req, res) => {
  try {
    const latestReport = await Report.findOne().sort({
      createdAt: -1
    });
    if (!latestReport) {
      return res.status(404).json({
        message: "Không tìm thấy report nào"
      });
    }
    res.json(latestReport);
  } catch (error) {
    console.error("Lỗi khi lấy report mới nhất:", error);
    res.status(500).json({
      message: "Lỗi server",
      error: error.message
    });
  }
});
module.exports = router;
module.exports = router;