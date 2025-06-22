import React from "react";
import "./Banner.css";

const Banner = () => {
  return (
    <section className="banner">
      <div className="banner-content">
        <div className="banner-text">
          <h2>Premium Brass & Metal Products</h2>
          <p>
            Discover our extensive collection of high-quality brass and metal
            items for all your needs
          </p>
          <button className="cta-button">Shop Now</button>
        </div>
        <div className="banner-image">
          <div className="placeholder-image">
            <span>Brass & Metal Products</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
