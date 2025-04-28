import React from 'react';
import "./BannerSection.css";

const BannerSection = () => {
  return (
    <div 
      className="banner-container" 
      style={{ backgroundImage: "url('/src/assets/MainBanner/MainBanner.jpg')" }}
    >
      <div className="banner-content">
        <div className="left-section">
          <h1 className="banner-title">Spring Sale is Here!</h1>
          <p className="banner-description">
            Celebrate the season with fresh styles and vibrant colors. Limited stock available!
          </p>
          <h4 className="banner-offer">Flat 30% off on all dresses.</h4>
          <div className="banner-dates">
            <span><strong>Start Date:</strong> 2025-04-01</span>
            <span><strong>End Date:</strong> 2025-04-30</span>
          </div>
          <button className="shop-now-btn">
            SHOP NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerSection;
