import { useState, useEffect } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const load = () => {
    api.get("/api/admin/users")
      .then((r) => setUsers(r.data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (id === currentUser._id) return toast.error("Cannot delete your own account");
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      toast.success("User deleted");
      load();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <AdminLayout title="Users">
      {loading ? <div className="loader" /> : (
        <div className="card" style={{ padding: 0 }}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%",
                          background: u.role === "admin" ? "var(--accent)" : "var(--gray2)",
                          color: u.role === "admin" ? "var(--black)" : "var(--white)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 700, flexShrink: 0,
                        }}>
                          {u.name[0].toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500 }}>{u.name}</span>
                        {u._id === currentUser._id && <span className="badge badge-accent" style={{ fontSize: 9 }}>You</span>}
                      </div>
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>{u.email}</td>
                    <td><span className={`badge ${u.role === "admin" ? "badge-accent" : "badge-gray"}`}>{u.role}</span></td>
                    <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(u._id)}
                        disabled={u._id === currentUser._id}
                      >
                        Delete
                      </button>
                    </td>
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
