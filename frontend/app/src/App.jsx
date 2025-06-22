import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Search from "./Search";
import Banner from "./Banner";
import Products from "./Products";
import AllProducts from "./AllProducts";
import Location from "./Location";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";
import Login from "./Login";
import Signup from "./Signup";
import Cart from "./Cart";
import Orders from "./Orders";
import Photos from "./Photos";
import Videos from "./Videos";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const adminAuth = localStorage.getItem("adminAuth");
    if (token) {
      setIsAuthenticated(true);
    }
    if (adminAuth === "true") {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    setCartItems([]);
  };

  const handleAdminLogin = () => {
    localStorage.setItem("adminAuth", "true");
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsAdminAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <Header
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          cartItems={cartItems}
          isAdmin={isAdminAuthenticated}
          onAdminLogout={handleAdminLogout}
        />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Search />
                <Banner />
                <Products
                  isAuthenticated={isAuthenticated}
                  setCartItems={setCartItems}
                />
                <Location />
                <AboutUs />
                <ContactUs />
              </>
            }
          />
          <Route
            path="/products"
            element={
              <AllProducts
                isAuthenticated={isAuthenticated}
                setCartItems={setCartItems}
              />
            }
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/cart"
            element={
              <Cart
                isAuthenticated={isAuthenticated}
                cartItems={cartItems}
                setCartItems={setCartItems}
              />
            }
          />
          <Route
            path="/orders"
            element={<Orders isAuthenticated={isAuthenticated} />}
          />
          <Route path="/photos" element={<Photos />} />
          <Route path="/videos" element={<Videos />} />
          <Route
            path="/admin/login"
            element={<AdminLogin onAdminLogin={handleAdminLogin} />}
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminDashboard
                isAdminAuthenticated={isAdminAuthenticated}
                onAdminLogout={handleAdminLogout}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
