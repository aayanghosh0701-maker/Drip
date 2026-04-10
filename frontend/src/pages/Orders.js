import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import "./Orders.css";

const STATUS_BADGE = {
  pending: "badge-yellow",
  processing: "badge-gray",
  shipped: "badge-green",
  delivered: "badge-green",
  cancelled: "badge-red",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/orders/my")
      .then((res) => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader" />;

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <h1>My Orders</h1>
          <p>{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📦</div>
            <h3>No orders yet</h3>
            <p>Your order history will appear here</p>
            <Link to="/shop" className="btn btn-primary" style={{ marginTop: 24 }}>Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card card">
                <div className="order-card__header">
                  <div>
                    <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="order-date">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                  <div className="order-card__right">
                    <span className={`badge ${STATUS_BADGE[order.status] || "badge-gray"}`}>
                      {order.status}
                    </span>
                    <span className="order-total">${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <div className="order-items-preview">
                  {order.items.slice(0, 4).map((item, i) => (
                    <img
                      key={i}
                      src={item.image || `https://placehold.co/60x75/1a1a1a/f5f5f0?text=${encodeURIComponent(item.name)}`}
                      alt={item.name}
                      title={item.name}
                      className="order-item-thumb"
                    />
                  ))}
                  {order.items.length > 4 && (
                    <div className="order-more">+{order.items.length - 4}</div>
                  )}
                </div>
                <div className="order-card__footer">
                  <p className="order-items-count">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                  {!order.isPaid && <span className="badge badge-red">Unpaid</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
