const express = require("express");
// Cart is managed client-side via localStorage for simplicity.
// This route exists for cart validation/price-check on checkout.
const Product = require("../models/Product");
const router = express.Router();

// @POST /api/cart/validate — validates cart items & returns fresh prices
router.post("/validate", async (req, res) => {
  try {
    const { items } = req.body;
    const validated = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) continue;
      validated.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        size: item.size,
        color: item.color,
        quantity: Math.min(item.quantity, product.stock),
      });
    }
    res.json({ items: validated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
