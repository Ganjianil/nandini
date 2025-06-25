import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Search.css";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

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
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, allProducts]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://nandini-1-io4g.onrender.com/viewproducts");
      setAllProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to products page with search term
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate("/products");
    }
    setShowSuggestions(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Show suggestions only when typing and there are matches
    if (value.trim() !== "" && value.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    navigate(`/products?search=${encodeURIComponent(suggestion)}`);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (searchTerm.trim() !== "" && searchSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <section className="search-section">
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
              SEARCH
            </button>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="search-suggestions">
              {searchSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onMouseDown={() => handleSuggestionClick(suggestion)}
                >
                  <span className="suggestion-icon">🔍</span>
                  <span className="suggestion-text">
                    {suggestion
                      .split(new RegExp(`(${searchTerm})`, "gi"))
                      .map((part, i) =>
                        part.toLowerCase() === searchTerm.toLowerCase() ? (
                          <strong key={i} className="highlight">
                            {part}
                          </strong>
                        ) : (
                          part
                        )
                      )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default Search;
