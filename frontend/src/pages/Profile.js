import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();
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
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const setField = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const setAddr = (field) => (e) => setForm({ ...form, address: { ...form.address, [field]: e.target.value } });
  const setPass = (field) => (e) => setPasswords({ ...passwords, [field]: e.target.value });

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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword)
      return toast.error("New passwords don't match!");
    if (passwords.newPassword.length < 6)
      return toast.error("Password must be at least 6 characters!");
    setPassLoading(true);
    try {
      await api.put("/api/auth/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setPassLoading(false);
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
            {user?.isVerified ? (
              <span className="badge badge-green" style={{ marginTop: 8 }}>✓ Verified</span>
            ) : (
              <span className="badge badge-red" style={{ marginTop: 8 }}>✗ Not Verified</span>
            )}
          </div>

          <div className="profile-right">
            {/* Personal Info Form */}
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
                <input value={form.address.street} onChange={setAddr("street")} placeholder="123 MG Road" />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>City</label>
                  <input value={form.address.city} onChange={setAddr("city")} placeholder="Mumbai" />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input value={form.address.state} onChange={setAddr("state")} placeholder="Maharashtra" />
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>PIN Code</label>
                  <input value={form.address.zip} onChange={setAddr("zip")} placeholder="400001" />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input value={form.address.country} onChange={setAddr("country")} placeholder="India" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>

            {/* Change Password Form */}
            <form className="profile-form card" onSubmit={handleChangePassword} style={{ marginTop: 24 }}>
              <h3>Change Password</h3>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password" value={passwords.currentPassword}
                  onChange={setPass("currentPassword")}
                  required placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password" value={passwords.newPassword}
                  onChange={setPass("newPassword")}
                  required placeholder="Min 6 characters"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password" value={passwords.confirmPassword}
                  onChange={setPass("confirmPassword")}
                  required placeholder="Repeat new password"
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={passLoading}>
                {passLoading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
