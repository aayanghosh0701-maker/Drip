import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="empty-state" style={{ marginTop: 80 }}>
          <div className="icon">🛍</div>
          <h3>Your cart is empty</h3>
          <p>Add some items to get started</p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: 24 }}>Start Shopping</Link>
        </div>
      </div>
    );
  }

  const shipping = cartTotal > 100 ? 0 : 9.99;
  const tax = cartTotal * 0.1;
  const total = cartTotal + shipping + tax;

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1>Your Cart</h1>
          <p>{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item, i) => (
              <div key={i} className="cart-item">
                <img
                  src={item.image || `https://placehold.co/100x125/1a1a1a/f5f5f0?text=${encodeURIComponent(item.name)}`}
                  alt={item.name}
                  className="cart-item__img"
                />
                <div className="cart-item__info">
                  <h4>{item.name}</h4>
                  <p className="cart-item__meta">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </p>
                  <p className="cart-item__price">${item.price.toFixed(2)}</p>
                </div>
                <div className="cart-item__controls">
                  <div className="qty-control">
                    <button onClick={() => updateQuantity(item.product, item.size, item.color, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product, item.size, item.color, item.quantity + 1)}>+</button>
                  </div>
                  <p className="cart-item__subtotal">${(item.price * item.quantity).toFixed(2)}</p>
                  <button className="remove-btn" onClick={() => removeFromCart(item.product, item.size, item.color)}>✕</button>
                </div>
              </div>
            ))}

            <button className="btn btn-outline btn-sm" onClick={clearCart}>Clear Cart</button>
          </div>

          <div className="cart-summary card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="badge badge-green">Free</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <hr className="divider" />
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            {cartTotal < 100 && (
              <p className="free-shipping-hint">
                Add ${(100 - cartTotal).toFixed(2)} more for free shipping!
              </p>
            )}
            <Link to="/checkout" className="btn btn-primary btn-full" style={{ marginTop: 20 }}>
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="btn btn-outline btn-full" style={{ marginTop: 10 }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
