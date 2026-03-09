const orderModel = require("../models/order");
const productModel = require("../models/product");

const buildOrderNumber = () => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${Date.now()}-${random}`;
};

const addOrder = async (req, res) => {
  try {
    const { product, quantity, status } = req.body;

    if (!product || !quantity) {
      return res.status(400).json({ success: false, message: "Product and quantity are required" });
    }

    const existingProduct = await productModel.findById(product);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (existingProduct.stock < Number(quantity)) {
      return res.status(400).json({ success: false, message: "Insufficient stock" });
    }

    existingProduct.stock -= Number(quantity);
    await existingProduct.save();

    const order = await orderModel.create({
      orderNumber: buildOrderNumber(),
      product,
      quantity,
      status: status || "pending",
    });

    return res.status(201).json({ success: true, message: "Order created", order });
  } catch (e) {
    console.error("Error creating order", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getOrders = async (_req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("product", "name sku")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (e) {
    console.error("Error fetching orders", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const updated = await orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, message: "Order updated", order: updated });
  } catch (e) {
    console.error("Error updating order", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await orderModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, message: "Order deleted" });
  } catch (e) {
    console.error("Error deleting order", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addOrder, getOrders, updateOrder, deleteOrder };
