const express = require("express");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");
const router = express.Router();

// @GET /api/products
router.get("/", async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, page = 1, limit = 12, featured } = req.query;
    const query = { isActive: true };

    if (category && category !== "all") query.category = category;
    if (featured) query.featured = true;
    if (search) query.$text = { $search: search };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      popular: { sold: -1 },
      rating: { rating: -1 },
    };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOptions[sort] || { createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.json({ products, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews.user", "name avatar");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/products/:id/reviews
router.post("/:id/reviews", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ message: "Already reviewed" });

    product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
