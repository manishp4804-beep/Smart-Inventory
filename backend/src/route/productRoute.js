const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/ProductController");

const router = express.Router();

router.post("/add", authMiddleware, addProduct);
router.get("/", authMiddleware, getProducts);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;
