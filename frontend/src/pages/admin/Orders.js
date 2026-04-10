import { useState, useEffect } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import AdminLayout from "./AdminLayout";

const STATUSES = ["pending","processing","shipped","delivered","cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get("/api/admin/orders")
      .then((r) => setOrders(r.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/admin/orders/${id}/status`, { status });
      toast.success("Status updated");
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
    } catch { toast.error("Update failed"); }
  };

  const statusColor = (s) => ({ delivered: "badge-green", cancelled: "badge-red", shipped: "badge-green", processing: "badge-gray", pending: "badge-yellow" }[s] || "badge-gray");

  return (
    <AdminLayout title="Orders">
      {loading ? <div className="loader" /> : (
        <div className="card" style={{ padding: 0 }}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Paid</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td><code>#{o._id.slice(-8).toUpperCase()}</code></td>
                    <td>
                      <div>
                        <p style={{ fontWeight: 500 }}>{o.user?.name || "—"}</p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{o.user?.email}</p>
                      </div>
                    </td>
                    <td>{o.items.length} item{o.items.length !== 1 ? "s" : ""}</td>
                    <td style={{ fontWeight: 600 }}>${o.totalPrice.toFixed(2)}</td>
                    <td>{o.isPaid ? <span className="badge badge-green">Paid</span> : <span className="badge badge-red">Unpaid</span>}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        style={{ background: "var(--gray2)", color: "var(--white)", border: "1px solid var(--gray3)", borderRadius: 4, padding: "4px 8px", fontSize: 12 }}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
