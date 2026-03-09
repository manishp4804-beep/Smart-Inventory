const categoryModel = require("../models/category");
const supplierModel = require("../models/supplier");
const productModel = require("../models/product");
const orderModel = require("../models/order");
const userModel = require("../models/userModels");

const getDashboardStats = async (_req, res) => {
  try {
    const [categories, suppliers, products, orders, users] = await Promise.all([
      categoryModel.countDocuments(),
      supplierModel.countDocuments(),
      productModel.countDocuments(),
      orderModel.countDocuments(),
      userModel.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        categories,
        suppliers,
        products,
        orders,
        users,
      },
    });
  } catch (e) {
    console.error("Error fetching stats", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getDashboardStats };
