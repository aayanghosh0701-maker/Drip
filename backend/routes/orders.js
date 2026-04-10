const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");
const router = express.Router();

// @POST /api/orders
router.post("/", protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    if (!items?.length) return res.status(400).json({ message: "No items" });

    const itemsPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 9.99;
    const taxPrice = parseFloat((itemsPrice * 0.1).toFixed(2));
    const totalPrice = parseFloat((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    // Update stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity },
      });
    }

    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/orders/my
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/orders/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/orders/:id/pay
router.put("/:id/pay", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = "processing";
    order.paymentResult = req.body;
    await order.save();
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
