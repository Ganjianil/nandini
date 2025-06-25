import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Products.css";

const Products = ({ isAuthenticated, setCartItems }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:10406/viewproducts");
      // Show only first 10 products on homepage
      setProducts(response.data.slice(0, 10));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    if (!isAuthenticated) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:10406/cart",
        { product_id: [productId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Product added to cart successfully!");
      fetchCartItems();
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart");
    }
  };

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:10406/viewcart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <section className="products-section">
      <div className="container">
        <h2>Our Products</h2>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.image_path ? (
                  <img
                    src={`http://localhost:10406/${product.image_path}`}
                    alt={product.product_name}
                  />
                ) : (
                  <div className="placeholder-product-image">
                    <span>No Image</span>
                  </div>
                )}
              </div>
              <div className="product-info">
                <h3>{product.product_name}</h3>
                <p className="product-description">{product.descripition}</p>
                <p className="product-price">₹{product.product_price}</p>
                <button
                  onClick={() => addToCart(product.id)}
                  className="add-to-cart-btn"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-container">
          <Link to="/products" className="view-all-btn">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Products;
