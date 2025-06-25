import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "./Orders.css";

const Orders = ({ isAuthenticated }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://nandini-1-io4g.onrender.com/myorders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Group orders by order_id
      const groupedOrders = response.data.reduce((acc, order) => {
        if (!acc[order.order_id]) {
          acc[order.order_id] = {
            order_id: order.order_id,
            order_date: order.order_date,
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

      setOrders(Object.values(groupedOrders));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div className="loading">Loading your orders...</div>;
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <h1>My Orders</h1>
          <p>Track your order history and status</p>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <h3>No orders found</h3>
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.order_id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.order_id}</h3>
                    <p className="order-date">
                      Placed on{" "}
                      {new Date(order.order_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="order-total">
                    <span className="total-label">Total</span>
                    <span className="total-amount">
                      ₹{order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Items ({order.items.length})</h4>
                  <div className="items-list">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span className="item-name">{item.product_name}</span>
                        <span className="item-price">
                          ₹{item.product_price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
