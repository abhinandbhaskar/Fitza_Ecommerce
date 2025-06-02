import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PaymentSection = ({ cartId, setCartId }) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [orderId, setOrderId] = useState(null);
    const { accessToken } = useSelector((state) => state.auth);
    const shopOrder = useSelector((state) => state.shoporder.order);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const navigate = useNavigate();
    

    const handleNavigate = (view) => {
    navigate("/profile", { state: { currentView: view } });
    };

    const handlePlaceOrder = async () => {
        setIsPlacingOrder(true);
        try {
            const paymentDetails = {
                transaction_id: "Cashondelivery",
                status: "pending", // COD orders are initially pending
                amount: shopOrder.orderTotal.toFixed(2),
                currency: "INR",
                payment_method: "cod",
                tracking_id: `COD_${Date.now()}`,
                gateway_response: { payment_id: "cod1", order_id: "cod1", signature: "cod1" },
                platform_fee: shopOrder.platformfee.toFixed(2),
                shipping_cost: shopOrder.shippingfee.toFixed(2),
                seller_payout: (shopOrder.orderTotal - (shopOrder.platformfee || 0)).toFixed(2),
            };

            await savePaymentDetails(paymentDetails);
            // Additional success handling if needed
        } catch (error) {
            console.error("Error placing COD order:", error);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const savePaymentDetails = async (paymentDetails) => {
        console.log("PAYMENT DETAILSSSSSSSSSSSSSSSSS", paymentDetails);
        try {
            const response = await fetch(`https://127.0.0.1:8000/api/save-payment-details/${cartId}/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Ensure accessToken is valid
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
                console.log("POPOPOPPIIIDD", data.payment_id);
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
        console.log("PYID", paymentId);
        try {
            const response = await fetch("https://127.0.0.1:8000/api/generate-bill/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ payment_id: paymentId }),
            });

            const data = await response.json();
            console.log("Bill generated:", data);
            setShowSuccessPopup(true);
        } catch (error) {
            console.error("Error generating bill:", error);
        }
    };

    // Function to handle Razorpay order creation

    const handleRazorpayPayment = async () => {
        try {
            const response = await fetch("https://127.0.0.1:8000/api/create-razorpay-order/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: shopOrder.orderTotal.toFixed(2), // The amount you want to pass from the state or input
                }),
            });

            const data = await response.json();
            console.log("OPOPOPOPOOOPPOOPOOPPOO", data);
            setOrderId(data.order_id);

            // Razorpay Payment integration logic
            if (orderId) {
                const options = {
                    key: "rzp_test_i9OIDqpDUXsLFj", // Your Razorpay Key ID
                    amount: data.amount * 100, // Amount in paise
                    currency: data.currency,
                    order_id: orderId, // The order ID created from Django
                    name: "Fitza",
                    description: "Payment for Order",
                    handler: function (response) {
                        console.log("Payment successful", response);

                        const paymentDetails = {
                            transaction_id: response.razorpay_payment_id,
                            status: "completed",
                            amount: data.amount,
                            currency: "INR",
                            payment_method: "razorpay",
                            tracking_id: "TRACK_" + response.razorpay_payment_id.slice(0, 10),
                            gateway_response: response,
                            platform_fee: shopOrder.platformfee === 0 ? 0 : shopOrder.platformfee.toFixed(2),
                            shipping_cost: shopOrder.shippingfee.toFixed(2),
                            seller_payout: data.amount - (shopOrder.platformfee || 0),
                        };

                        console.log("MYPAIseeee", paymentDetails);

                        // Call the API to store payment details
                        savePaymentDetails(paymentDetails);
                    },
                    prefill: {
                        name: data.user?.name || "Customer Name", // Fallback if no user
                        email: data.user?.email || "customer@example.com",
                        contact: data.user?.phone || "1234567890",
                    },
                };

                const razorpay = new window.Razorpay(options);

                // Add all necessary event listeners
                razorpay.on("close", function () {
                    resetScroll();
                });

                razorpay.on("payment.failed", function (response) {
                    resetScroll();
                });

                razorpay.open();

                // Store the Razorpay instance in state if needed for later access
                setRazorpayInstance(razorpay);
            }
        } catch (error) {
            console.error("Payment error:", error);
            // Ensure scroll is restored even on error
            resetScroll();
        }
    };

    const resetScroll = () => {
        // Solution 1: Direct DOM manipulation
        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";

        // Solution 2: For React apps with CSS-in-JS (like styled-components)
        const root = document.getElementById("root");
        if (root) {
            root.style.overflow = "auto";
        }

        // Solution 3: Trigger a re-render if needed
        setForceUpdate((prev) => !prev);
    };

    const SuccessPopup = () => {
        return (
            <div className="fixed inset-0 bg-red-400 bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                                onClick={() =>handleNavigate("myorders")}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-bag-shopping text-white"></i>
                                Track Order
                            </button>
                               <button
                                onClick={() => {
                                    setShowSuccessPopup(false); // Hide the popup
                                    navigate("/"); // Redirect to the home page
                                }}
                                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition"
                                >
                                Continue Shopping
                                </button>
                        </div>

                        {/* Additional info */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                Need help?{" "}
                                <a href="/contact" className="text-blue-600 hover:underline">
                                    Contact us
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row gap-8 p-6 lg:px-[200px] lg:p-10">
            <div className="bg-white shadow-lg rounded-lg flex-1 p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Select Payment Method</h1>
                <div className="space-y-6">
                    <div
                        className={`flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition ${
                            selectedPaymentMethod === "cod" ? "ring-2 ring-blue-500" : ""
                        }`}
                        onClick={() => setSelectedPaymentMethod("cod")}
                    >
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">Cash On Delivery</h2>
                            <p className="text-gray-600 text-sm">Price: ₹{shopOrder.orderTotal.toFixed(2)}</p>
                        </div>
                        {selectedPaymentMethod === "cod" ? (
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlaceOrder();
                                }}
                                disabled={isPlacingOrder}
                            >
                                {isPlacingOrder ? "Placing Order..." : "Place Order"}
                            </button>
                        ) : (
                            <input
                                type="radio"
                                name="payment-method"
                                className="w-5 h-5 accent-blue-600"
                                checked={selectedPaymentMethod === "cod"}
                                readOnly
                            />
                        )}
                    </div>
                    <div
                        className={`flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition ${
                            selectedPaymentMethod === "online" ? "ring-2 ring-blue-500" : ""
                        }`}
                        onClick={() => setSelectedPaymentMethod("online")}
                    >
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">Pay Online</h2>
                            <p className="text-gray-600 text-sm">Price: ₹{shopOrder.orderTotal.toFixed(2)}</p>
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
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Pay Online via Razorpay</h2>
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
                    ) : (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Coupon Applied</span>
                            <span className="text-green-600 font-medium">{shopOrder.couponapplied}</span>
                        </div>
                    )}

                    {/* Discount Card - Only shown if > 0 */}
                    {shopOrder.discountcard > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Card Discount</span>
                            <span className="text-green-600 font-medium">- ₹{shopOrder.discountcard}</span>
                        </div>
                    )}
                </div>

                {/* Order Total - Highlighted section */}
                <div className="flex justify-between pt-4 border-t">
                    <span className="text-lg font-bold text-gray-800">Order Total</span>
                    <span className="text-lg font-bold text-gray-800">₹{shopOrder.orderTotal.toFixed(2)}</span>
                </div>
            </div>

            {/* Success Popup */}
            {showSuccessPopup && <SuccessPopup />}
        </div>
    );
};

export default PaymentSection;
