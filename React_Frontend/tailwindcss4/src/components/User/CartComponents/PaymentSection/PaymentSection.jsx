import React from "react";

const PaymentSection = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row gap-8 p-6 lg:px-[200px] lg:p-10">
      {/* Payment Method Section */}
      <div className="bg-white shadow-lg rounded-lg flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Select Payment Method
        </h1>
        <div className="space-y-6">
          {/* Cash On Delivery */}
          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Cash On Delivery
              </h2>
              <p className="text-gray-600 text-sm">Price: $200</p>
            </div>
            <input
              type="radio"
              name="payment-method"
              className="w-5 h-5 accent-blue-600"
            />
          </div>

          {/* Pay Online */}
          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Pay Online</h2>
              <p className="text-gray-600 text-sm">Price: $200</p>
            </div>
            <input
              type="radio"
              name="payment-method"
              className="w-5 h-5 accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Price Details Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full lg:w-1/3">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Price Details
        </h2>
        <div className="border-b pb-4 mb-4 space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Total MRP:</span>
            <span>$100</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Discount:</span>
            <span>-$20</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping Fee:</span>
            <span>$15</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Platform Fee:</span>
            <span>$10</span>
          </div>
        </div>
        <div className="flex justify-between text-gray-800 text-lg font-bold">
          <span>Order Total:</span>
          <span>$105</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
