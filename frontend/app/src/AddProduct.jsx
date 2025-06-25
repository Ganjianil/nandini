import React, { useState } from "react";
import axios from "axios";
import "./AddProduct.css";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    product_name: "",
    product_price: "",
    descripition: "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formDataToSend = new FormData();
    formDataToSend.append("product_name", formData.product_name);
    formDataToSend.append("product_price", formData.product_price);
    formDataToSend.append("descripition", formData.descripition);

    images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    try {
      const response = await axios.post(
        "http://localhost:10406/products",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Product added successfully!");
      setFormData({ product_name: "", product_price: "", descripition: "" });
      setImages([]);
      // Reset file input
      document.getElementById("images").value = "";
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product">
      <div className="add-product-header">
        <h2>Add New Product</h2>
        <p>Fill in the details below to add a new product to your inventory</p>
      </div>

      {message && (
        <div
          className={`message ${
            message.includes("successfully") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Product Name *</label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="form-group">
          <label>Product Price (₹) *</label>
          <input
            type="number"
            name="product_price"
            value={formData.product_price}
            onChange={handleChange}
            placeholder="Enter price"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="descripition"
            value={formData.descripition}
            onChange={handleChange}
            placeholder="Enter product description"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Product Images *</label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          <small>You can select multiple images (JPG, PNG, GIF)</small>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Adding Product...
            </>
          ) : (
            <>
              <span>➕</span>
              Add Product
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
