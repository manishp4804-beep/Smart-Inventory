const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./route/auth");
const categoryRoutes = require("./route/categoryRoute");
const supplierRoutes = require("./route/supplierRoute");
const productRoutes = require("./route/productRoute");
const orderRoutes = require("./route/orderRoute");
const userRoutes = require("./route/userRoute");
const statsRoutes = require("./route/statsRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stats", statsRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

module.exports = app;
