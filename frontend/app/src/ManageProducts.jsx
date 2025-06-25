import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageProducts.css";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:10406/viewproducts");
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:10406/deleteproducts/${productId}`);
        setMessage("Product deleted successfully!");
        fetchProducts(); // Refresh the list
      } catch (error) {
        console.error("Error deleting product:", error);
        setMessage("Failed to delete product.");
      }
    }
  };

  const deleteAllProducts = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete ALL products? This action cannot be undone!"
      )
    ) {
      try {
        await axios.delete("http://localhost:10406/deleteallproducts");
        setMessage("All products deleted successfully!");
        fetchProducts(); // Refresh the list
      } catch (error) {
        console.error("Error deleting all products:", error);
        setMessage("Failed to delete all products.");
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="manage-products">
      <div className="manage-header">
        <h2>Manage Products</h2>
        <button onClick={deleteAllProducts} className="delete-all-btn">
          Delete All Products
        </button>
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

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.image_path ? (
                      <img
                        src={`http://localhost:10406/${product.image_path}`}
                        alt={product.product_name}
                        className="product-thumbnail"
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>
                  <td>{product.product_name}</td>
                  <td>₹{product.product_price}</td>
                  <td className="description-cell">{product.descripition}</td>
                  <td>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
