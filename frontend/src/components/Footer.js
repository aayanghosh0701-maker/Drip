import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">AURA</span>
          <p>Wear what you feel.</p>
        </div>
        <div className="footer__links">
          <div>
            <h4>Shop</h4>
            <Link to="/shop/men">Men</Link>
            <Link to="/shop/women">Women</Link>
            <Link to="/shop/unisex">Unisex</Link>
            <Link to="/shop/accessories">Accessories</Link>
          </div>
          <div>
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/profile">Profile</Link>
          </div>
          <div>
            <h4>Info</h4>
            <a href="#">About Us</a>
            <a href="#">Shipping Policy</a>
            <a href="#">Returns</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} AURA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
