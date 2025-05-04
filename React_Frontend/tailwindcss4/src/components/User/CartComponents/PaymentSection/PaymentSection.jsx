import React, { useState } from "react";
import { useSelector } from "react-redux";

const PaymentSection = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [orderId, setOrderId] = useState(null);
  const{accessToken}=useSelector((state)=>state.auth);
  

  // Function to handle Razorpay order creation
  const handleRazorpayPayment = async () => {
    const response = await fetch("https://127.0.0.1:8000/api/create-razorpay-order/", {
      method: "POST",
      headers: {
        "Authorization":`Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 2, // The amount you want to pass from the state or input
      }),
    });

    const data = await response.json();
    setOrderId(data.order_id);

    // Razorpay Payment integration logic
    if (orderId) {
      const options = {
        key: "rzp_test_i9OIDqpDUXsLFj", // Your Razorpay Key ID
        amount: 200 * 100, // Amount in paise
        currency: "INR",
        order_id: orderId, // The order ID created from Django
        name: "Your Company Name",
        description: "Payment for Order",
        handler: function (response) {
          console.log("Payment successful", response);
          // Handle successful payment here (save payment details, etc.)
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "1234567890",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row gap-8 p-6 lg:px-[200px] lg:p-10">
      <div className="bg-white shadow-lg rounded-lg flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Select Payment Method
        </h1>
        <div className="space-y-6">
          <div
            className={`flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition ${
              selectedPaymentMethod === "cod" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setSelectedPaymentMethod("cod")}
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Cash On Delivery</h2>
              <p className="text-gray-600 text-sm">Price: $200</p>
            </div>
            <input
              type="radio"
              name="payment-method"
              className="w-5 h-5 accent-blue-600"
              checked={selectedPaymentMethod === "cod"}
              readOnly
            />
          </div>

          <div
            className={`flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition ${
              selectedPaymentMethod === "online" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setSelectedPaymentMethod("online")}
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Pay Online</h2>
              <p className="text-gray-600 text-sm">Price: $200</p>
            </div>
            <input
              type="radio"
              name="payment-method"
              className="w-5 h-5 accent-blue-600"
              checked={selectedPaymentMethod === "online"}
              readOnly
            />
          </div>

          {selectedPaymentMethod === "online" && (
            <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Pay Online via Razorpay
              </h2>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
                onClick={handleRazorpayPayment}
              >
                Proceed to Payment
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full lg:w-1/3">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Price Details</h2>
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
