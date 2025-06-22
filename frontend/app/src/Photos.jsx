import React from "react";
import "./Photos.css";

const Photos = () => {
  // Sample photo data - replace with actual photos from your backend
  const photos = [
    { id: 1, title: "Brass Decorative Items", category: "Decorative" },
    { id: 2, title: "Metal Hardware", category: "Hardware" },
    { id: 3, title: "Brass Fittings", category: "Fittings" },
    { id: 4, title: "Custom Metal Work", category: "Custom" },
    { id: 5, title: "Brass Ornaments", category: "Ornaments" },
    { id: 6, title: "Industrial Parts", category: "Industrial" },
  ];

  return (
    <div className="photos-page">
      <div className="container">
        <div className="page-header">
          <h1>Photo Gallery</h1>
          <p>Explore our collection of brass and metal products</p>
        </div>

        <div className="photos-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="photo-card">
              <div className="photo-placeholder">
                <span className="photo-icon">📷</span>
                <p>{photo.title}</p>
              </div>
              <div className="photo-info">
                <h3>{photo.title}</h3>
                <span className="photo-category">{photo.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Photos;
