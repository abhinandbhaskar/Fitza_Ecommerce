import React from 'react'
import "./BannerSection.css";
const BannerSection = () => {
  return (
    <div className='banner-container'>
        <div className='banner-content'>
            <div className='left-section'>
            <p>Taking your Viewing Experience to Next Level</p>
                <h1>Summer Sale</h1>
                <button className='px-4 py-2 bg-white text-xl text-red-400 rounded-md hover:border-2 border-white hover:bg-red-300 hover:text-white'>SHOP NOW</button>
            </div>
        </div>
    </div>
    
  )
}

export default BannerSection
