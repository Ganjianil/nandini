import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <section className="about-section">
      <div className="container">
        <h2>About Nadhini Brass and Metals</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              Welcome to Nadhini Brass and Metals, your trusted partner for
              premium quality brass and metal products. With years of experience
              in the industry, we have established ourselves as a leading
              supplier of high-quality metal products.
            </p>
            <p>
              Our commitment to excellence and customer satisfaction has made us
              a preferred choice for customers across the region. We offer a
              wide range of brass and metal products suitable for various
              applications.
            </p>
            <div className="features">
              <div className="feature">
                <h4>Quality Assurance</h4>
                <p>
                  All our products undergo strict quality checks to ensure
                  durability and performance.
                </p>
              </div>
              <div className="feature">
                <h4>Wide Range</h4>
                <p>
                  We offer an extensive collection of brass and metal products
                  for all your needs.
                </p>
              </div>
              <div className="feature">
                <h4>Expert Service</h4>
                <p>
                  Our experienced team provides expert guidance and support for
                  all your requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
