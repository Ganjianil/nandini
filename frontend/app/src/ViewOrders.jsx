import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ViewOrders.css";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8085/admin/orders");
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:8085/order/${orderId}/status`, {
        status,
      });
      alert(`Order status updated to ${status}`);
      fetchOrders(); // Refresh the list
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  // Group orders by order_id
  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.order_id]) {
      acc[order.order_id] = {
        order_id: order.order_id,
        order_date: order.order_date,
        status: order.status,
        username: order.username,
        // Address details
        name: order.name,
        email: order.email,
        phone: order.phone,
        street: order.street,
        city: order.city,
        zip: order.zip,
        country: order.country,
        items: [],
        total: 0,
      };
    }
    acc[order.order_id].items.push({
      product_name: order.product_name,
      product_price: order.product_price,
    });
    acc[order.order_id].total += parseFloat(order.product_price);
    return acc;
  }, {});

  const ordersList = Object.values(groupedOrders);

  return (
    <div className="view-orders">
      <h2>All Orders</h2>

      {ordersList.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-list">
          {ordersList.map((order) => (
            <div key={order.order_id} className="order-card">
              <div className="order-header">
                <div className="order-basic-info">
                  <h3>Order #{order.order_id}</h3>
                  <div className="order-meta">
                    <p>
                      <strong>Customer:</strong> {order.username}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(order.order_date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <span
                        className={`status-badge ${order.status || "pending"}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </p>
                    <p>
                      <strong>Total:</strong> ₹{order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleOrderDetails(order.order_id)}
                  className="toggle-details-btn"
                >
                  {expandedOrder === order.order_id
                    ? "Hide Details"
                    : "View Details"}
                </button>
              </div>

              {expandedOrder === order.order_id && (
                <div className="order-details">
                  {/* Customer Address Information */}
                  <div className="address-section">
                    <h4>Delivery Address</h4>
                    <div className="address-card">
                      <div className="address-row">
                        <div className="address-field">
                          <label>Full Name:</label>
                          <span>{order.name}</span>
                        </div>
                        <div className="address-field">
                          <label>Email:</label>
                          <span>{order.email}</span>
                        </div>
                      </div>

                      <div className="address-row">
                        <div className="address-field">
                          <label>Phone:</label>
                          <span>{order.phone}</span>
                        </div>
                        <div className="address-field">
                          <label>ZIP Code:</label>
                          <span>{order.zip}</span>
                        </div>
                      </div>

                      <div className="address-field full-width">
                        <label>Street Address:</label>
                        <span>{order.street}</span>
                      </div>

                      <div className="address-row">
                        <div className="address-field">
                          <label>City:</label>
                          <span>{order.city}</span>
                        </div>
                        <div className="address-field">
                          <label>Country:</label>
                          <span>{order.country}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="order-items">
                    <h4>Order Items ({order.items.length})</h4>
                    <div className="items-table">
                      <div className="table-header">
                        <span>Product Name</span>
                        <span>Price</span>
                      </div>
                      {order.items.map((item, index) => (
                        <div key={index} className="table-row">
                          <span>{item.product_name}</span>
                          <span>₹{item.product_price}</span>
                        </div>
                      ))}
                      <div className="table-footer">
                        <span>
                          <strong>Total Amount:</strong>
                        </span>
                        <span>
                          <strong>₹{order.total.toFixed(2)}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="order-actions">
                    <h4>Update Order Status</h4>
                    <div className="status-buttons">
                      <button
                        onClick={() =>
                          updateOrderStatus(order.order_id, "processing")
                        }
                        className="status-btn processing"
                      >
                        Mark Processing
                      </button>
                      <button
                        onClick={() =>
                          updateOrderStatus(order.order_id, "shipped")
                        }
                        className="status-btn shipped"
                      >
                        Mark Shipped
                      </button>
                      <button
                        onClick={() =>
                          updateOrderStatus(order.order_id, "delivered")
                        }
                        className="status-btn delivered"
                      >
                        Mark Delivered
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewOrders;
