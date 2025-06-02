import React, { useState } from "react";
import { useSelector } from "react-redux";

const PaymentSection = ({ cartId, setCartId }) => {
  // ... (previous state declarations)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // ... (other existing functions remain the same)

  // Success Popup Component
  const SuccessPopup = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95 hover:scale-100">
          {/* Close button */}
          <button 
            onClick={() => setShowSuccessPopup(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          >
            <i className="fa-solid fa-xmark p-2 text-gray-500 text-lg"></i>
          </button>
          
          {/* Content */}
          <div className="p-8 text-center">
            {/* Success icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-circle-check text-green-500 text-5xl"></i>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-check text-white text-xs"></i>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h3>
            
            {/* Message */}
            <p className="text-gray-600 mb-6">
              Your order has been confirmed. You'll receive an email with the order details shortly.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  // Navigate to order tracking page
                  window.location.href = "/orders";
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-bag-shopping text-white"></i>
                Track Order
              </button>
              <button
                onClick={() => {
                  setShowSuccessPopup(false);
                  // Continue shopping - redirect or close
                  window.location.href = "/";
                }}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition"
              >
                Continue Shopping
              </button>
            </div>
            
            {/* Additional info */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact us</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row gap-8 p-6 lg:px-[200px] lg:p-10 relative">
      {/* ... (rest of your existing JSX) */}
      
      {/* Success Popup */}
      {showSuccessPopup && <SuccessPopup />}
    </div>
  );
};

export default PaymentSection;