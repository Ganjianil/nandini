import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Cart.css";

const Cart = ({ isAuthenticated, cartItems, setCartItems }) => {
  const [loading, setLoading] = useState(true);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    zip: "",
    country: "India",
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    }
  }, [isAuthenticated]);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:10406/viewcart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { name, email, phone, street, city, zip } = addressForm;
    if (!name || !email || !phone || !street || !city || !zip) {
      alert("Please fill in all required fields");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return false;
    }

    // Basic phone validation
    if (phone.length < 10) {
      alert("Please enter a valid phone number");
      return false;
    }

    return true;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setCheckoutLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:10406/checkout",
        {
          address: addressForm,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order placed successfully!");
      setCartItems([]);
      setShowCheckoutForm(false);
      setAddressForm({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        zip: "",
        country: "India",
      });
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }
    setShowCheckoutForm(true);
  };

  const handleCancelCheckout = () => {
    setShowCheckoutForm(false);
    setAddressForm({
      name: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      zip: "",
      country: "India",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="cart-container">
        <h2>Please login to view your cart</h2>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  const totalAmount = cartItems.reduce(
    (total, item) => total + parseFloat(item.product_price),
    0
  );

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          {!showCheckoutForm ? (
            <div className="cart-content">
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <h3>{item.product_name}</h3>
                    <p className="item-price">₹{item.product_price}</p>
                  </div>
                ))}
              </div>
              <div className="cart-summary">
                <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
                <button
                  onClick={handleProceedToCheckout}
                  className="checkout-btn"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          ) : (
            <div className="checkout-form-container">
              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="summary-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="summary-item">
                      <span>{item.product_name}</span>
                      <span>₹{item.product_price}</span>
                    </div>
                  ))}
                </div>
                <div className="summary-total">
                  <strong>Total: ₹{totalAmount.toFixed(2)}</strong>
                </div>
              </div>

              <div className="checkout-form">
                <h3>Delivery Address</h3>
                <form onSubmit={handleCheckout}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={addressForm.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={addressForm.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={addressForm.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>ZIP/Postal Code *</label>
                      <input
                        type="text"
                        name="zip"
                        value={addressForm.zip}
                        onChange={handleInputChange}
                        placeholder="Enter ZIP code"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Street Address *</label>
                    <input
                      type="text"
                      name="street"
                      value={addressForm.street}
                      onChange={handleInputChange}
                      placeholder="Enter your street address"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={addressForm.city}
                        onChange={handleInputChange}
                        placeholder="Enter your city"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <select
                        name="country"
                        value={addressForm.country}
                        onChange={handleInputChange}
                      >
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={handleCancelCheckout}
                      className="cancel-btn"
                    >
                      Back to Cart
                    </button>
                    <button
                      type="submit"
                      disabled={checkoutLoading}
                      className="place-order-btn"
                    >
                      {checkoutLoading ? "Placing Order..." : "Place Order"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
