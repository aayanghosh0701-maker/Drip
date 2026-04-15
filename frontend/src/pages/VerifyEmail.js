import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../utils/api";
import "./Auth.css";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading"); // loading, success, error

  useEffect(() => {
    if (!token) { setStatus("error"); return; }
    api.get(`/api/auth/verify-email?token=${token}`)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-card card" style={{ textAlign: "center" }}>
        <div className="auth-logo">AURA</div>
        {status === "loading" && (
          <>
            <h2>Verifying...</h2>
            <p className="auth-sub">Please wait while we verify your email.</p>
            <div className="loader" />
          </>
        )}
        {status === "success" && (
          <>
            <div style={{ fontSize: "3rem", margin: "20px 0" }}>✅</div>
            <h2>Email Verified!</h2>
            <p className="auth-sub">Your account is now active. You can login!</p>
            <Link to="/login" className="btn btn-primary btn-full" style={{ marginTop: 20 }}>
              Go to Login
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <div style={{ fontSize: "3rem", margin: "20px 0" }}>❌</div>
            <h2>Verification Failed</h2>
            <p className="auth-sub">This link is invalid or expired.</p>
            <Link to="/login" className="btn btn-primary btn-full" style={{ marginTop: 20 }}>
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
