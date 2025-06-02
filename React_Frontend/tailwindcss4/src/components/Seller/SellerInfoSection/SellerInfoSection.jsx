import React from "react";
import sellerBanner from "../../../assets/SellerMainBanner/seller.jpg";
const SellerInfoSection = ({ value }) => {
  return (
    <section className="w-full min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-12 py-16">
        {/* Left Side: Content */}
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Grow Your Business with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              Fitza
            </span>
          </h1> 
          <p className="text-lg text-gray-600 leading-relaxed">
            Join our marketplace of trusted sellers and reach millions of customers.
            We provide the platform, tools, and support you need to scale your business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="px-8 py-3 bg-gradient-to-r from-red-400 to-red-600 text-white font-medium rounded-lg hover:from-red-500 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              Register as Seller
            </button>
            <button className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-red-400 hover:text-red-600 transition-all duration-300">
              Learn More
            </button>
          </div>
          
          <div className="pt-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Why Sell With Us
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-red-500 mr-3">✓</span>
                <span className="text-gray-700">Zero setup fees</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-red-500 mr-3">✓</span>
                <span className="text-gray-700">Competitive commission</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-red-500 mr-3">✓</span>
                <span className="text-gray-700">Fast payout options</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-red-500 mr-3">✓</span>
                <span className="text-gray-700">24/7 seller support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Image with your background URL */}
<div 
  className="relative w-[460px] max-w-xl aspect-square rounded-2xl overflow-hidden shadow-xl bg-yellow-300"
  style={{
    animation: 'float 3s ease-in-out infinite',
  }}
>
  <div className="absolute inset-0">
    <img
      className="w-full h-full object-cover"
      style={{ filter: 'brightness(0.95)' }}
      src={sellerBanner}
      alt="Seller Banner"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end p-8">
      <p className="text-white font-medium text-lg">Seller Dashboard Preview</p>
    </div>
  </div>
</div>

<style jsx>{`
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`}</style>
        
      </div>
    </section>
  );
};

export default SellerInfoSection;