const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Product = require("./models/Product");
const User = require("./models/User");

const products = [
  // UNISEX
  { name: "Classic White Tee", description: "A timeless unisex white tee made from 100% organic cotton. Ultra-soft, breathable, and built to last.", price: 29.99, originalPrice: 39.99, category: "unisex", sizes: ["XS","S","M","L","XL","XXL"], colors: ["white","black","gray"], stock: 120, images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"], featured: true, tags: ["basics","cotton"] },
  { name: "Oversized Hoodie", description: "Drop-shoulder hoodie in heavyweight fleece. The kind you never want to take off.", price: 74.99, category: "unisex", sizes: ["S","M","L","XL","XXL"], colors: ["black","cream","forest"], stock: 80, images: ["https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80"], featured: true, tags: ["hoodie","streetwear"] },
  { name: "Wide-Leg Cargos", description: "Relaxed fit cargo pants with functional pockets. Street-ready and endlessly versatile.", price: 89.99, originalPrice: 109.99, category: "unisex", sizes: ["XS","S","M","L","XL"], colors: ["khaki","black","olive"], stock: 60, images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80"], featured: true, tags: ["cargo","pants"] },
  { name: "Ribbed Knit Sweater", description: "Cozy ribbed knit sweater with a relaxed fit. The perfect layering piece for cooler days.", price: 59.99, category: "unisex", sizes: ["XS","S","M","L","XL"], colors: ["camel","oatmeal","charcoal"], stock: 55, images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80"], featured: true, tags: ["knit","sweater"] },
  { name: "Graphic Print Tee", description: "Bold graphic print on premium cotton. Make a statement without saying a word.", price: 34.99, category: "unisex", sizes: ["XS","S","M","L","XL","XXL"], colors: ["black","white"], stock: 95, images: ["https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80"], featured: true, tags: ["graphic","streetwear"] },
  { name: "Fleece Sweatpants", description: "Ultra-cozy fleece sweatpants with elastic waistband and side pockets.", price: 54.99, category: "unisex", sizes: ["XS","S","M","L","XL","XXL"], colors: ["gray","black","navy"], stock: 100, images: ["https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80"], featured: false, tags: ["sweatpants","cozy"] },
  { name: "Relaxed Linen Shirt", description: "Breathable linen shirt with a breezy relaxed fit. Summer essential.", price: 49.99, category: "unisex", sizes: ["XS","S","M","L","XL","XXL"], colors: ["white","sage","sand"], stock: 70, images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80"], featured: false, tags: ["linen","summer"] },
  { name: "Zip-Up Track Jacket", description: "Retro-inspired track jacket with contrast zip. Perfect for layering over anything.", price: 64.99, originalPrice: 79.99, category: "unisex", sizes: ["S","M","L","XL"], colors: ["black","navy","burgundy"], stock: 45, images: ["https://images.unsplash.com/photo-1605908502724-9093a79a6ae3?w=600&q=80"], featured: false, tags: ["jacket","track"] },
  // MEN
  { name: "Slim Fit Chinos", description: "Tailored slim-fit chinos that take you from desk to dinner without skipping a beat.", price: 69.99, category: "men", sizes: ["S","M","L","XL","XXL"], colors: ["navy","stone","black"], stock: 70, images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80"], featured: false, tags: ["chinos","formal"] },
  { name: "Oxford Button-Down Shirt", description: "Classic Oxford shirt in breathable cotton. Timeless style for every occasion.", price: 54.99, originalPrice: 69.99, category: "men", sizes: ["S","M","L","XL","XXL"], colors: ["white","light-blue","pink"], stock: 65, images: ["https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80"], featured: true, tags: ["shirt","oxford"] },
  { name: "Denim Trucker Jacket", description: "Classic denim trucker jacket with a modern slim fit. A wardrobe essential.", price: 99.99, category: "men", sizes: ["S","M","L","XL"], colors: ["light-denim","dark-denim"], stock: 40, images: ["https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80"], featured: true, tags: ["denim","jacket"] },
  { name: "Polo Shirt", description: "Classic polo shirt in premium pique cotton. Smart-casual perfection.", price: 44.99, category: "men", sizes: ["S","M","L","XL","XXL"], colors: ["white","navy","black"], stock: 90, images: ["https://images.unsplash.com/photo-1625910513519-a7d8ac605f8e?w=600&q=80"], featured: false, tags: ["polo","smart-casual"] },
  { name: "Bomber Jacket", description: "Sleek bomber jacket with ribbed cuffs and hem. Street style staple.", price: 119.99, originalPrice: 149.99, category: "men", sizes: ["S","M","L","XL"], colors: ["black","olive","navy"], stock: 35, images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80"], featured: true, tags: ["bomber","jacket"] },
  { name: "Slim Fit Joggers", description: "Tapered joggers with a clean silhouette. The perfect blend of comfort and style.", price: 59.99, category: "men", sizes: ["S","M","L","XL","XXL"], colors: ["black","charcoal","olive"], stock: 85, images: ["https://images.unsplash.com/photo-1600717535275-0b18ede2f7fc?w=600&q=80"], featured: false, tags: ["joggers","casual"] },
  // WOMEN
  { name: "Satin Slip Dress", description: "Effortlessly elegant slip dress in silky satin. Dress up or down for any occasion.", price: 64.99, category: "women", sizes: ["XS","S","M","L"], colors: ["champagne","black","dusty-rose"], stock: 45, images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80"], featured: true, tags: ["dress","elegant"] },
  { name: "High-Waist Wide Leg Pants", description: "Flattering high-waist wide leg trousers. Elegant and comfortable for all-day wear.", price: 79.99, category: "women", sizes: ["XS","S","M","L","XL"], colors: ["black","cream","camel"], stock: 55, images: ["https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=600&q=80"], featured: true, tags: ["pants","wide-leg"] },
  { name: "Cropped Blazer", description: "Structured cropped blazer with a modern fit. Style it over anything for instant polish.", price: 89.99, originalPrice: 109.99, category: "women", sizes: ["XS","S","M","L"], colors: ["black","white","camel"], stock: 40, images: ["https://images.unsplash.com/photo-1594938298603-c8148c4b4e5f?w=600&q=80"], featured: true, tags: ["blazer","formal"] },
  { name: "Ribbed Crop Top", description: "Form-fitting ribbed crop top. A versatile wardrobe staple that goes with everything.", price: 24.99, category: "women", sizes: ["XS","S","M","L"], colors: ["white","black","brown","pink"], stock: 110, images: ["https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&q=80"], featured: false, tags: ["crop-top","basics"] },
  { name: "Floral Wrap Dress", description: "Flowy floral wrap dress in lightweight fabric. Perfect for any occasion.", price: 54.99, category: "women", sizes: ["XS","S","M","L","XL"], colors: ["floral-blue","floral-pink"], stock: 60, images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80"], featured: false, tags: ["dress","floral"] },
  { name: "Pleated Midi Skirt", description: "Elegant pleated midi skirt in flowing fabric. Effortlessly chic for any occasion.", price: 49.99, category: "women", sizes: ["XS","S","M","L"], colors: ["black","dusty-rose","sage"], stock: 65, images: ["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80"], featured: true, tags: ["skirt","midi"] },
  { name: "Oversized Denim Jacket", description: "Vintage-inspired oversized denim jacket. The ultimate layering piece.", price: 84.99, category: "women", sizes: ["XS","S","M","L","XL"], colors: ["light-denim","dark-denim"], stock: 50, images: ["https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&q=80"], featured: false, tags: ["denim","jacket"] },
  // ACCESSORIES
  { name: "Canvas Tote Bag", description: "Heavy-duty canvas tote with reinforced straps. Minimal, functional, and eco-friendly.", price: 24.99, category: "accessories", sizes: ["One Size"], colors: ["natural","black"], stock: 200, images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80"], featured: false, tags: ["bag","eco"] },
  { name: "Leather Belt", description: "Full-grain leather belt with a classic buckle. Built to last a lifetime.", price: 39.99, category: "accessories", sizes: ["S","M","L","XL"], colors: ["black","brown","tan"], stock: 80, images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"], featured: false, tags: ["belt","leather"] },
  { name: "Structured Cap", description: "Clean structured cap with an adjustable strap. The finishing touch to any outfit.", price: 29.99, category: "accessories", sizes: ["One Size"], colors: ["black","white","navy","beige"], stock: 120, images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80"], featured: true, tags: ["cap","hat"] },
  { name: "Knit Beanie", description: "Soft ribbed knit beanie. Keeps you warm without compromising style.", price: 19.99, category: "accessories", sizes: ["One Size"], colors: ["black","gray","cream","rust"], stock: 150, images: ["https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&q=80"], featured: false, tags: ["beanie","winter"] },
  { name: "Crossbody Bag", description: "Compact crossbody bag in vegan leather. Fits everything you need for a day out.", price: 59.99, originalPrice: 74.99, category: "accessories", sizes: ["One Size"], colors: ["black","tan","white"], stock: 55, images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80"], featured: true, tags: ["bag","crossbody"] },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    await Product.deleteMany({});
    console.log("🗑  Cleared existing products");
    const created = await Product.insertMany(products);
    console.log(`✅ Inserted ${created.length} products`);
    const existing = await User.findOne({ email: "admin@drip.com" });
    if (!existing) {
      await User.create({ name: "Admin", email: "admin@drip.com", password: "admin123", role: "admin" });
      console.log("✅ Admin created: admin@drip.com / admin123");
    } else {
      console.log("ℹ️  Admin already exists");
    }
    console.log("\n🔥 Seed complete! Your store has", created.length, "products.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
}
seed();
