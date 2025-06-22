import React from 'react';
import './Videos.css';

const Videos = () => {
  // Sample video data - replace with actual videos from your backend
  const videos = [
    { id: 1, title: 'Manufacturing Process', duration: '3:45', category: 'Process' },
    { id: 2, title: 'Product Showcase', duration: '2:30', category: 'Showcase' },
    { id: 3, title: 'Quality Testing', duration: '4:15', category: 'Quality' },
    { id: 4, title: 'Custom Orders', duration: '5:20', category: 'Custom' },
    { id: 5, title: 'Company Tour', duration: '6:10', category: 'Tour' },
    { id: 6, title: 'Installation Guide', duration: '3:55', category: 'Guide' },
  ];

  return (
    <div className="videos-page">
      <div className="container">
        <div className="page-header">
          <h1>Video Gallery</h1>
          <p>Watch our manufacturing process and product demonstrations</p>
        </div>

        <div className="videos-grid">
          {videos.map((video) => (
            <div key={video.id} className="video-card">
              <div className="video-placeholder">
                <span className="video-icon">🎥</span>
                <div className="play-button">▶</div>
                <span className="video-duration">{video.duration}</span>
              </div>
              <div className="video-info">
                <h3>{video.title}</h3>
                <span className="video-category">{video.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Videos;
