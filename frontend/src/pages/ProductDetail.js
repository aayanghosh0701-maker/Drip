import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then((res) => {
        setProduct(res.data.product);
        setSelectedSize(res.data.product.sizes?.[0] || "");
        setSelectedColor(res.data.product.colors?.[0] || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length) return toast.error("Please select a size");
    addToCart(product, selectedSize, selectedColor, qty);
    toast.success("Added to cart!");
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/products/${id}/reviews`, { rating: reviewRating, comment: reviewComment });
      toast.success("Review submitted!");
      setReviewComment("");
      const res = await api.get(`/api/products/${id}`);
      setProduct(res.data.product);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error submitting review");
    }
  };

  if (loading) return <div className="loader" />;
  if (!product) return <div className="empty-state"><h3>Product not found</h3></div>;

  const images = product.images?.length
    ? product.images
    : [`https://placehold.co/600x750/1a1a1a/f5f5f0?text=${encodeURIComponent(product.name)}`];

  return (
    <div className="product-detail">
      <div className="container">
        <div className="product-detail__layout">
          {/* Images */}
          <div className="product-detail__gallery">
            <div className="gallery-main">
              <img src={images[activeImg]} alt={product.name} />
            </div>
            {images.length > 1 && (
              <div className="gallery-thumbs">
                {images.map((img, i) => (
                  <button key={i} className={`thumb ${i === activeImg ? "active" : ""}`} onClick={() => setActiveImg(i)}>
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail__info">
            <p className="product-detail__category">{product.category}</p>
            <h1 className="product-detail__name">{product.name}</h1>
            <div className="product-detail__rating">
              <span className="stars">{"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}</span>
              <span>{product.numReviews} reviews</span>
            </div>
            <div className="product-detail__price">
              <span className="price-main">${product.price.toFixed(2)}</span>
              {product.originalPrice && <span className="price-old">${product.originalPrice.toFixed(2)}</span>}
            </div>
            <p className="product-detail__desc">{product.description}</p>

            {product.colors?.length > 0 && (
              <div className="product-detail__options">
                <p className="options-label">Color: <strong>{selectedColor}</strong></p>
                <div className="color-swatches">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      className={`color-swatch ${selectedColor === c ? "active" : ""}`}
                      style={{ background: c.toLowerCase() }}
                      onClick={() => setSelectedColor(c)}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div className="product-detail__options">
                <p className="options-label">Size: <strong>{selectedSize}</strong></p>
                <div className="size-grid">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className={`size-btn ${selectedSize === s ? "active" : ""}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="product-detail__qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
            </div>

            <button className="btn btn-primary btn-full" onClick={handleAddToCart} disabled={product.stock === 0}>
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <div className="product-detail__meta">
              <span>Stock: {product.stock} left</span>
              <span>SKU: {product._id.slice(-8).toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews-section">
          <h2>Reviews ({product.numReviews})</h2>
          {product.reviews?.length === 0 && <p className="no-reviews">No reviews yet. Be the first!</p>}
          <div className="reviews-list">
            {product.reviews?.map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <span className="review-name">{r.name}</span>
                  <span className="stars">{"★".repeat(r.rating)}</span>
                </div>
                <p>{r.comment}</p>
                <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>

          {user && (
            <form className="review-form" onSubmit={handleReview}>
              <h3>Write a Review</h3>
              <div className="form-group">
                <label>Rating</label>
                <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))}>
                  {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary">Submit Review</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
