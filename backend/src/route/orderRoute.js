const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const {
  addOrder,
  getOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/OrderController");

const router = express.Router();

router.post("/add", authMiddleware, addOrder);
router.get("/", authMiddleware, getOrders);
router.put("/:id", authMiddleware, updateOrder);
router.delete("/:id", authMiddleware, deleteOrder);

module.exports = router;
