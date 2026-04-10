import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";
import "./Profile.css";

export default function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zip: user?.address?.zip || "",
      country: user?.address?.country || "",
    },
  });
  const [loading, setLoading] = useState(false);

  const setField = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const setAddr = (field) => (e) => setForm({ ...form, address: { ...form.address, [field]: e.target.value } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/api/auth/profile", form);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1>My Profile</h1>
        </div>
        <div className="profile-layout">
          <div className="profile-avatar-card card">
            <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
            <span className={`badge ${user?.role === "admin" ? "badge-accent" : "badge-gray"}`}>
              {user?.role}
            </span>
          </div>

          <form className="profile-form card" onSubmit={handleSubmit}>
            <h3>Personal Info</h3>
            <div className="form-row-2">
              <div className="form-group">
                <label>Name</label>
                <input value={form.name} onChange={setField("name")} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={setField("email")} required />
              </div>
            </div>

            <h3 style={{ marginTop: 24 }}>Shipping Address</h3>
            <div className="form-group">
              <label>Street</label>
              <input value={form.address.street} onChange={setAddr("street")} placeholder="123 Main St" />
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>City</label>
                <input value={form.address.city} onChange={setAddr("city")} placeholder="New York" />
              </div>
              <div className="form-group">
                <label>State</label>
                <input value={form.address.state} onChange={setAddr("state")} placeholder="NY" />
              </div>
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>ZIP</label>
                <input value={form.address.zip} onChange={setAddr("zip")} placeholder="10001" />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input value={form.address.country} onChange={setAddr("country")} placeholder="US" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
