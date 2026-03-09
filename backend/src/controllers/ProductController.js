const productModel = require("../models/product");

const addProduct = async (req, res) => {
  try {
    const { name, sku, category, supplier, price, stock } = req.body;

    if (!name || !sku || !category || !supplier || price == null || stock == null) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existing = await productModel.findOne({ $or: [{ name }, { sku }] });
    if (existing) {
      return res.status(400).json({ success: false, message: "Product name or SKU already exists" });
    }

    const product = await productModel.create({ name, sku, category, supplier, price, stock });
    return res.status(201).json({ success: true, message: "Product created", product });
  } catch (e) {
    console.error("Error adding product", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getProducts = async (_req, res) => {
  try {
    const products = await productModel
      .find()
      .populate("category", "categoryName")
      .populate("supplier", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, products });
  } catch (e) {
    console.error("Error fetching products", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, category, supplier, price, stock } = req.body;

    if (!name || !sku || !category || !supplier || price == null || stock == null) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const duplicate = await productModel.findOne({
      _id: { $ne: id },
      $or: [{ name }, { sku }],
    });
    if (duplicate) {
      return res.status(400).json({ success: false, message: "Product name or SKU already exists" });
    }

    const product = await productModel.findByIdAndUpdate(
      id,
      { name, sku, category, supplier, price, stock },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, message: "Product updated", product });
  } catch (e) {
    console.error("Error updating product", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await productModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, message: "Product deleted" });
  } catch (e) {
    console.error("Error deleting product", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addProduct, getProducts, updateProduct, deleteProduct };
