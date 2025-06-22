import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import AddProduct from './AddProduct';
import ManageProducts from './ManageProducts';
import ViewOrders from './ViewOrders';
import './AdminDashboard.css';

const AdminDashboard = ({ isAdminAuthenticated, onAdminLogout }) => {
  const [activeTab, setActiveTab] = useState('add-product');

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'add-product':
        return <AddProduct />;
      case 'manage-products':
        return <ManageProducts />;
      case 'view-orders':
        return <ViewOrders />;
      default:
        return <AddProduct />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={onAdminLogout} className="logout-btn">
          Logout
        </button>
      </div>
      
      <div className="admin-content">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <button
              className={`nav-btn ${activeTab === 'add-product' ? 'active' : ''}`}
              onClick={() => setActiveTab('add-product')}
            >
              <span className="nav-icon">➕</span>
              Add Product
            </button>
            <button
              className={`nav-btn ${activeTab === 'manage-products' ? 'active' : ''}`}
              onClick={() => setActiveTab('manage-products')}
            >
              <span className="nav-icon">📦</span>
              Manage Products
            </button>
            <button
              className={`nav-btn ${activeTab === 'view-orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('view-orders')}
            >
              <span className="nav-icon">📋</span>
              View Orders
            </button>
          </nav>
        </div>
        
        <div className="admin-main">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;