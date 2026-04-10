import { useState, useEffect } from "react";
import api from "../../utils/api";
import AdminLayout from "./AdminLayout";
import "./Admin.css";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/api/admin/stats"), api.get("/api/admin/orders")])
      .then(([statsRes, ordersRes]) => {
        setStats(statsRes.data);
        setOrders(ordersRes.data.orders.slice(0, 8));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout title="Dashboard"><div className="loader" /></AdminLayout>;

  return (
    <AdminLayout title="Dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-card__label">Total Revenue</p>
          <p className="stat-card__value">${stats?.revenue?.toFixed(0)}</p>
          <p className="stat-card__sub">From paid orders</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Orders</p>
          <p className="stat-card__value">{stats?.totalOrders}</p>
          <p className="stat-card__sub">All time</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Products</p>
          <p className="stat-card__value">{stats?.totalProducts}</p>
          <p className="stat-card__sub">In catalog</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Customers</p>
          <p className="stat-card__value">{stats?.totalUsers}</p>
          <p className="stat-card__sub">Registered</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--gray2)" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Recent Orders</h3>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td><code>#{o._id.slice(-8).toUpperCase()}</code></td>
                  <td>{o.user?.name || "—"}</td>
                  <td>${o.totalPrice.toFixed(2)}</td>
                  <td><span className={`badge badge-${o.status === "delivered" ? "green" : o.status === "cancelled" ? "red" : "yellow"}`}>{o.status}</span></td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
