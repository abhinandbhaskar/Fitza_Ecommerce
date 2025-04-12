import React from "react";

const SellerInfoSection = () => {
  return (
    <section className="border-2 border-red-400 w-screen h-screen p-8 flex items-center  justify-between">
      {/* Left Side: Website Name and Register Button */}
      <div>
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">
          Welcome to <span className="text-red-500">Fitza</span>
        </h1>
        <p className="text-gray-700 mb-6">
          Join us as a seller and start showcasing your products to a wider audience.
        </p>
        <button className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700">
          Register
        </button>
      </div>

      {/* Right Side: Placeholder for Additional Content or Illustration */}
      <div className="hidden md:block">
        {/* Placeholder for image or content */}
        <img
          src="https://via.placeholder.com/300"
          alt="Seller illustration"
          className="rounded-lg shadow-md"
        />
      </div>
    </section>
  );
};

export default SellerInfoSection;
