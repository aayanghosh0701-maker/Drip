const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    category: {
      type: String,
      required: true,
      enum: ["men", "women", "unisex", "kids", "accessories"],
    },
    subCategory: { type: String },
    images: [{ type: String }],
    sizes: [{ type: String, enum: ["XS", "S", "M", "L", "XL", "XXL", "One Size"] }],
    colors: [{ type: String }],
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    tags: [String],
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Product", productSchema);
