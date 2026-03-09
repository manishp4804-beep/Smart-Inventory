const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const { getDashboardStats } = require("../controllers/StatsController");

const router = express.Router();

router.get("/", authMiddleware, getDashboardStats);

module.exports = router;
