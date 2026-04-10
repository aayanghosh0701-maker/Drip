import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import "./Home.css";

const CATEGORIES = [
  { label: "Men", slug: "men", emoji: "👔" },
  { label: "Women", slug: "women", emoji: "👗" },
  { label: "Unisex", slug: "unisex", emoji: "🧥" },
  { label: "Accessories", slug: "accessories", emoji: "👜" },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/products?featured=true&limit=8")
      .then((res) => setFeatured(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">New Collection — 2026</p>
          <h1 className="hero__title">
            WEAR<br />
            WHAT<br />
            <span>YOU FEEL</span>
          </h1>
          <p className="hero__subtitle">Unisex streetwear for every body, every mood.</p>
          <div className="hero__cta">
            <Link to="/shop" className="btn btn-primary">Shop Now</Link>
            <Link to="/shop/new" className="btn btn-outline">New Arrivals</Link>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__blob" />
          <img
            src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600&q=80"
            alt="Fashion"
            className="hero__img"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link to={`/shop/${cat.slug}`} key={cat.slug} className="category-card">
                <span className="category-card__emoji">{cat.emoji}</span>
                <span className="category-card__label">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Drops</h2>
            <Link to="/shop" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {loading ? (
            <div className="loader" />
          ) : featured.length === 0 ? (
            <div className="empty-state">
              <p>No featured products yet. Add some from the admin panel!</p>
            </div>
          ) : (
            <div className="products-grid">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Banner */}
      <section className="promo-banner">
        <div className="container promo-banner__inner">
          <div>
            <h2>Free Shipping</h2>
            <p>On all orders over $100</p>
          </div>
          <div>
            <h2>Easy Returns</h2>
            <p>30-day hassle-free returns</p>
          </div>
          <div>
            <h2>Secure Payment</h2>
            <p>100% protected with Stripe</p>
          </div>
          <div>
            <h2>Support 24/7</h2>
            <p>We're here whenever you need</p>
          </div>
        </div>
      </section>
    </div>
  );
}
