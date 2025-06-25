import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AllProducts.css";

const AllProducts = ({ isAuthenticated, setCartItems }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search term
    if (searchTerm.trim() === "") {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(
        (product) =>
          product.product_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.descripition.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, allProducts]);

  useEffect(() => {
    // Generate search suggestions
    if (searchTerm.trim() !== "" && searchTerm.length > 0) {
      const suggestions = allProducts
        .filter((product) =>
          product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((product) => product.product_name)
        .filter((name, index, self) => self.indexOf(name) === index) // Remove duplicates
        .slice(0, 5); // Limit to 5 suggestions

      setSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, allProducts]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://nandini-1-io4g.onrender.com/viewproducts");
      setAllProducts(response.data);
      setFilteredProducts(response.data);
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
        "https://nandini-1-io4g.onrender.com/cart",
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
      const response = await axios.get("https://nandini-1-io4g.onrender.com/viewcart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (searchTerm.trim() !== "" && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="all-products-page">
      <div className="container">
        <div className="page-header">
          <h1>All Products</h1>

          {/* Enhanced Search Bar */}
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search for brass and metal products..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="search-input"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="clear-search-btn"
                  >
                    ×
                  </button>
                )}
                <button type="submit" className="search-btn">
                  🔍
                </button>
              </div>

              {/* Search Suggestions */}
              {showSuggestions && (
                <div className="search-suggestions">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span className="suggestion-icon">🔍</span>
                      <span className="suggestion-text">{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          <div className="results-info">
            {searchTerm ? (
              <p>
                Showing {indexOfFirstProduct + 1}-
                {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
                {filteredProducts.length} results for "{searchTerm}"
              </p>
            ) : (
              <p>
                Showing {indexOfFirstProduct + 1}-
                {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
                {filteredProducts.length} products
              </p>
            )}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <h3>No products found</h3>
            <p>Try adjusting your search terms or browse all products.</p>
            {searchTerm && (
              <button onClick={clearSearch} className="clear-search-btn-large">
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="products-grid">
              {currentProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    {product.image_path ? (
                      <img
                        src={`https://nandini-1-io4g.onrender.com/${product.image_path}`}
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
                    <p className="product-description">
                      {product.descripition}
                    </p>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn prev"
                >
                  ← Previous
                </button>

                <div className="pagination-numbers">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`pagination-number ${
                          currentPage === pageNumber ? "active" : ""
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn next"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
