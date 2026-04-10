import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const size = product.sizes?.[0] || "One Size";
    const color = product.colors?.[0] || "";
    addToCart(product, size, color);
    toast.success("Added to cart!");
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-card__image">
        <img
          src={product.images?.[0] || `https://placehold.co/400x500/1a1a1a/f5f5f0?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
        />
        {discount && <span className="product-card__discount">-{discount}%</span>}
        {product.featured && <span className="product-card__featured">Featured</span>}
        <button className="product-card__quick-add" onClick={handleQuickAdd}>
          Quick Add
        </button>
      </div>
      <div className="product-card__info">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__price">
          <span className="price-current">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="price-original">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
        {product.rating > 0 && (
          <div className="product-card__rating">
            <span className="stars">{"★".repeat(Math.round(product.rating))}</span>
            <span>({product.numReviews})</span>
          </div>
        )}
      </div>
    </Link>
  );
}
