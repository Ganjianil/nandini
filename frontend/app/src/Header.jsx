import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({
  isAuthenticated,
  onLogout,
  cartItems,
  isAdmin,
  onAdminLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleAdminLogout = () => {
    onAdminLogout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <h1>Nadhini Brass and Metals</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <div className="nav-links">
            {!isAdmin && (
              <Link to="/cart" className="cart-link">
                Cart ({cartItems.length})
              </Link>
            )}

            {isAdmin ? (
              <div className="admin-section">
                <Link to="/admin/dashboard" className="admin-link">
                  Admin Dashboard
                </Link>
                <button
                  onClick={handleAdminLogout}
                  className="auth-btn logout-btn"
                >
                  Admin Logout
                </button>
              </div>
            ) : (
              <>
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="auth-btn logout-btn"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="auth-links">
                    <Link to="/login" className="auth-btn login-btn">
                      Login
                    </Link>
                    <Link to="/signup" className="auth-btn signup-btn">
                      Signup
                    </Link>
                  </div>
                )}
                <Link to="/admin/login" className="admin-btn">
                  Admin
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="mobile-nav">
          {!isAdmin && (
            <Link
              to="/cart"
              className="mobile-cart-link"
              onClick={closeMobileMenu}
            >
              Cart ({cartItems.length})
            </Link>
          )}
          <button className="hamburger-btn" onClick={toggleMobileMenu}>
            <span
              className={`hamburger-line ${isMobileMenuOpen ? "active" : ""}`}
            ></span>
            <span
              className={`hamburger-line ${isMobileMenuOpen ? "active" : ""}`}
            ></span>
            <span
              className={`hamburger-line ${isMobileMenuOpen ? "active" : ""}`}
            ></span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`mobile-menu-overlay ${isMobileMenuOpen ? "active" : ""}`}
          onClick={closeMobileMenu}
        >
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h3>Menu</h3>
              <button className="close-menu-btn" onClick={closeMobileMenu}>
                ×
              </button>
            </div>

            <div className="mobile-menu-items">
              <Link
                to="/"
                className="mobile-menu-item"
                onClick={closeMobileMenu}
              >
                <span className="menu-icon">🏠</span>
                Home
              </Link>

              <Link
                to="/products"
                className="mobile-menu-item"
                onClick={closeMobileMenu}
              >
                <span className="menu-icon">📦</span>
                Products
              </Link>

              {isAuthenticated && (
                <Link
                  to="/orders"
                  className="mobile-menu-item"
                  onClick={closeMobileMenu}
                >
                  <span className="menu-icon">📋</span>
                  Orders
                </Link>
              )}

              <Link
                to="/photos"
                className="mobile-menu-item"
                onClick={closeMobileMenu}
              >
                <span className="menu-icon">📷</span>
                Photos
              </Link>

              <Link
                to="/videos"
                className="mobile-menu-item"
                onClick={closeMobileMenu}
              >
                <span className="menu-icon">🎥</span>
                Videos
              </Link>

              <div className="menu-divider"></div>

              {isAdmin ? (
                <div className="mobile-admin-section">
                  <Link
                    to="/admin/dashboard"
                    className="mobile-menu-item"
                    onClick={closeMobileMenu}
                  >
                    <span className="menu-icon">⚙️</span>
                    Admin Dashboard
                  </Link>
                  <button
                    onClick={handleAdminLogout}
                    className="mobile-menu-item logout"
                  >
                    <span className="menu-icon">🚪</span>
                    Admin Logout
                  </button>
                </div>
              ) : (
                <>
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="mobile-menu-item logout"
                    >
                      <span className="menu-icon">🚪</span>
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="mobile-menu-item"
                        onClick={closeMobileMenu}
                      >
                        <span className="menu-icon">👤</span>
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="mobile-menu-item"
                        onClick={closeMobileMenu}
                      >
                        <span className="menu-icon">📝</span>
                        Signup
                      </Link>
                    </>
                  )}
                  <Link
                    to="/admin/login"
                    className="mobile-menu-item admin"
                    onClick={closeMobileMenu}
                  >
                    <span className="menu-icon">🔐</span>
                    Admin Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
