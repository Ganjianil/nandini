import React from "react";
import "./Location.css";

const Location = () => {
  return (
    <section className="location-section">
      <div className="container">
        <h2>Our Location</h2>
        <div className="location-content">
          <div className="location-info">
            <h3>Visit Our Store</h3>
            <div className="address">
              <p>
                <strong>Nadhini Brass and Metals</strong>
              </p>
              <p>Uppal, Hyderabad</p>
              <p>Telangana - 500036</p>
              <p>India</p>
            </div>
            <div className="contact-info">
              <p>
                <strong>Phone:</strong> +91 XXXXXXXXXX
              </p>
              <p>
                <strong>Email:</strong> info@nadhinibrassmetals.com
              </p>
            </div>
            <div className="business-hours">
              <h4>Business Hours</h4>
              <p>Monday - Saturday: 9:00 AM - 7:00 PM</p>
              <p>Sunday: 10:00 AM - 5:00 PM</p>
            </div>
          </div>
          <div className="map-placeholder">
            <div className="map-container">
              <span>Map Location</span>
              <p>Uppal, Hyderabad</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
