import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";
import "./Checkout.css";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: "", city: "", state: "", zip: "", country: "IN",
  });

  const shipping = cartTotal > 999 ? 0 : 99;
  const tax = cartTotal * 0.18;
  const total = cartTotal + shipping + tax;

  const setAddr = (f) => (e) => setAddress({ ...address, [f]: e.target.value });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/payment/create-order", { amount: total });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "DRIP",
        description: "Order Payment",
        order_id: data.orderId,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#e8ff3b" },
        handler: async (response) => {
          try {
            await api.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            const { data: orderData } = await api.post("/api/orders", {
              items: cart,
              shippingAddress: address,
              paymentMethod: "razorpay",
              paymentResult: {
                id: response.razorpay_payment_id,
                status: "succeeded",
                email: user.email,
              },
            });

            await api.put(`/api/orders/${orderData.order._id}/pay`, {
              id: response.razorpay_payment_id,
              status: "succeeded",
              email: user.email,
            });

            clearCart();
            toast.success("Order placed successfully! 🎉");
            navigate("/orders");
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="page-header">
          <h1>Checkout</h1>
        </div>

        <div className="checkout-layout">
          <div className="checkout-steps">
            <div className="step-indicator">
              {["Shipping", "Review & Pay"].map((s, i) => (
                <div key={s} className={`step ${step > i + 1 ? "done" : ""} ${step === i + 1 ? "active" : ""}`}>
                  <div className="step-num">{step > i + 1 ? "✓" : i + 1}</div>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="checkout-form card">
                <h3>Shipping Address</h3>
                <div className="form-group">
                  <label>Street Address</label>
                  <input value={address.street} onChange={setAddr("street")} placeholder="123 MG Road" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input value={address.city} onChange={setAddr("city")} placeholder="Mumbai" required />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input value={address.state} onChange={setAddr("state")} placeholder="Maharashtra" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>PIN Code</label>
                    <input value={address.zip} onChange={setAddr("zip")} placeholder="400001" required />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <select value={address.country} onChange={setAddr("country")}>
                      <option value="IN">India</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (!address.street || !address.city || !address.state || !address.zip)
                      return toast.error("Please fill all address fields");
                    setStep(2);
                  }}
                >
                  Continue to Review
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-form card">
                <h3>Review Your Order</h3>
                <div className="review-items">
                  {cart.map((item, i) => (
                    <div key={i} className="review-item">
                      <img src={item.image || `https://placehold.co/60x75/1a1a1a/f5f5f0?text=${encodeURIComponent(item.name)}`} alt={item.name} />
                      <div>
                        <p className="review-item-name">{item.name}</p>
                        <p className="review-item-meta">{item.size} · {item.color} · Qty {item.quantity}</p>
                      </div>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="review-address">
                  <p className="review-label">Shipping to</p>
                  <p>{address.street}, {address.city}, {address.state} {address.zip}, {address.country}</p>
                </div>
                <div className="razorpay-info">
                  <p>🔒 Secure payment via Razorpay</p>
                  <p>Supports UPI · QR Code · Cards · Net Banking · Wallets</p>
                </div>
                <div className="form-actions">
                  <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary" onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? "Opening Payment..." : `Pay ₹${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="checkout-summary card">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.map((item, i) => (
                <div key={i} className="summary-item">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <hr className="divider" />
            <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="badge badge-green">Free</span> : `₹${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row"><span>GST (18%)</span><span>₹{tax.toFixed(2)}</span></div>
            <hr className="divider" />
            <div className="summary-row summary-total">
              <span>Total</span><span>₹{total.toFixed(2)}</span>
            </div>
            {cartTotal < 999 && (
              <p className="free-shipping-hint">Add ₹{(999 - cartTotal).toFixed(2)} more for free shipping!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}