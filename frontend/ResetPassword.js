import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import "./Auth.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error("Passwords don't match");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await api.post("/api/auth/reset-password", { token, password: form.password });
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return (
    <div className="auth-page">
      <div className="auth-card card">
        <h2>Invalid Link</h2>
        <p className="auth-sub">This reset link is invalid or expired.</p>
        <Link to="/forgot-password" className="btn btn-primary btn-full" style={{ marginTop: 20 }}>
          Request New Link
        </Link>
      </div>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">DRIP</div>
        <h2>Reset Password</h2>
        <p className="auth-sub">Enter your new password</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required placeholder="Min 6 characters"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password" value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required placeholder="Repeat password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
