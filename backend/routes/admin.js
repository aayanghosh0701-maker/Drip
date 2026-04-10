const express = require("express");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/auth");
const router = express.Router();

router.use(protect, adminOnly);

// Dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const [totalUsers, totalOrders, totalProducts, orders] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      Order.find({ isPaid: true }),
    ]);
    const revenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
    res.json({ totalUsers, totalOrders, totalProducts, revenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Products CRUD
router.get("/products", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ products });
});

router.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Orders management
router.get("/orders", async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json({ orders });
});

router.put("/orders/:id/status", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Users management
router.get("/users", async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ users });
});

router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
