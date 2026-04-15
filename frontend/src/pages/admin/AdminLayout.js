import { NavLink } from "react-router-dom";
import "./Admin.css";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/products", label: "Products", icon: "👕" },
  { to: "/admin/orders", label: "Orders", icon: "📦" },
  { to: "/admin/users", label: "Users", icon: "👥" },
];

export default function AdminLayout({ children, title }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">AURA<span>Admin</span></div>
        <nav className="admin-nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}>
              <span>{n.icon}</span> {n.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="admin-main">
        <div className="admin-header">
          <h1>{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
}
