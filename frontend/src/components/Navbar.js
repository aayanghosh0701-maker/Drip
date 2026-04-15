import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">AURA</Link>

        <div className={`navbar__links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/shop" onClick={() => setMenuOpen(false)}>All</NavLink>
          <NavLink to="/shop/men" onClick={() => setMenuOpen(false)}>Men</NavLink>
          <NavLink to="/shop/women" onClick={() => setMenuOpen(false)}>Women</NavLink>
          <NavLink to="/shop/unisex" onClick={() => setMenuOpen(false)}>Unisex</NavLink>
          <NavLink to="/shop/accessories" onClick={() => setMenuOpen(false)}>Accessories</NavLink>
        </div>

        <div className="navbar__actions">
          <Link to="/cart" className="navbar__cart">
            <span>🛍</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="navbar__user" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <span className="navbar__avatar">{user.name[0].toUpperCase()}</span>
              {dropdownOpen && (
                <div className="navbar__dropdown">
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}>Profile</Link>
                  <Link to="/orders" onClick={() => setDropdownOpen(false)}>My Orders</Link>
                  {user.role === "admin" && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)}>Admin</Link>
                  )}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
          )}

          <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </nav>
  );
}
