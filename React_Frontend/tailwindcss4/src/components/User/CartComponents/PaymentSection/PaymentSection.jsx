import React, { useState } from "react";
import { useSelector } from "react-redux";

const PaymentSection = ({cartId,setCartId}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [orderId, setOrderId] = useState(null);
  const{accessToken}=useSelector((state)=>state.auth);
  const shopOrder = useSelector((state) => state.shoporder.order);

  const savePaymentDetails = async (paymentDetails) => {
    console.log("PAYMENT DETAILSSSSSSSSSSSSSSSSS", paymentDetails);
    try {
      const response = await fetch(`https://127.0.0.1:8000/api/save-payment-details/${cartId}/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`, // Ensure accessToken is valid
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentDetails),
      });
  
      console.log("Response Status:", response.status); // Log HTTP status code
  
      // Check response status
      if (response.ok) {
        const data = await response.json();
        console.log("Payment details saved successfully:", data);
        setCartId(null); // Reset cartId if payment is successful
        console.log("POPOPOPPIIIDD",data.payment_id);
        await generateBill(data.payment_id);


        // Handle further actions like updating the UI or triggering a shipping API
      } else {
        console.error("Failed to save payment details. Response status:", response.status);
        const errorData = await response.json(); // Extract error details
        console.error("Response Error Data:", errorData);
      }
    } catch (error) {
      console.error("Error saving payment details:", error.message);
      if (error.response) {
        console.error("Response Data:", error.response.data); // Log server-side error details
      }
    }
  };



    const generateBill = async (paymentId) => {
    try {
      const response = await fetch("https://127.0.0.1:8000/api/generate-bill/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payment_id: paymentId }),
      });

      const data = await response.json();
      console.log("Bill generated:", data);
    } catch (error) {
      console.error("Error generating bill:", error);
    }
  };

  

  // Function to handle Razorpay order creation
  const handleRazorpayPayment = async () => {
    const response = await fetch("https://127.0.0.1:8000/api/create-razorpay-order/", {
      method: "POST",
      headers: {
        "Authorization":`Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 200, // The amount you want to pass from the state or input
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
         
          const paymentDetails = {
            transaction_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            status: "completed", // Assuming the payment is successful
            amount: 200.00, // The amount paid
            currency: "INR",
            gateway_response: response, // Store the full response from Razorpay
          };
        
          // Call the API to store payment details
          savePaymentDetails(paymentDetails);  
          
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
    {/* Total MRP - Always shown */}
    <div className="flex justify-between">
      <span className="text-gray-600">Total MRP</span>
      <span className="text-gray-800 font-medium">₹{shopOrder.totalmrp.toFixed(2)}</span>
    </div>

    {/* Product Discount - Only shown if > 0 */}
    {shopOrder.productdiscount > 0 && (
      <div className="flex justify-between">
        <span className="text-gray-600">Product Discount</span>
        <span className="text-green-600 font-medium">- ₹{shopOrder.productdiscount.toFixed(2)}</span>
      </div>
    )}

    {/* Shipping Fee - Shows "FREE" if 0 */}
    <div className="flex justify-between">
      <span className="text-gray-600">Shipping Fee</span>
      <span className="text-gray-800 font-medium">
        {shopOrder.shippingfee > 0 ? `₹${shopOrder.shippingfee.toFixed(2)}` : "FREE"}
      </span>
    </div>

    {/* Platform Fee - Always shown */}
    <div className="flex justify-between">
      <span className="text-gray-600">Platform Fee</span>
      <span className="text-gray-800 font-medium">₹{shopOrder.platformfee.toFixed(1)}</span>
    </div>

    {/* Coupon Applied - Only shown if exists */}
    {shopOrder.couponapplied === 0 ? (
      <div></div>
    ):(
      <div className="flex justify-between">
        <span className="text-gray-600">Coupon Applied</span>
        <span className="text-green-600 font-medium">{shopOrder.couponapplied}</span>
      </div>
    )}

    {/* Discount Card - Only shown if > 0 */}
    {shopOrder.discountcard > 0 && (
      <div className="flex justify-between">
        <span className="text-gray-600">Card Discount</span>
        <span className="text-green-600 font-medium">- ₹{shopOrder.discountcard.toFixed(2)}</span>
      </div>
    )}
  </div>

  {/* Order Total - Highlighted section */}
  <div className="flex justify-between pt-4 border-t">
    <span className="text-lg font-bold text-gray-800">Order Total</span>
    <span className="text-lg font-bold text-gray-800">₹{shopOrder.orderTotal.toFixed(2)}</span>
  </div>
</div>
    </div>
  );
};

export default PaymentSection;
