import React, { useState } from "react";
import Header from "../../../components/User/Header/Header";
import Footer from "../../../components/User/Footer/Footer";
import CartSection from "../../../components/User/CartComponents/CartSection/CartSection";
import AddressSection from "../../../components/User/CartComponents/AddressSection/AddressSection";
import PaymentSection from "../../../components/User/CartComponents/PaymentSection/PaymentSection";
const CartPage = ({ countsN, cartCount, setCartCount }) => {
    const [cartView, setCartView] = useState("cart");
    const [cartId, setCartId] = useState(null);
    const [section, setSection] = useState("cart");
    return (
        <>
            <Header countsN={countsN} cartCount={cartCount} />
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white py-6 shadow-sm">
                    <div className="max-w-3xl mx-auto px-4">
                        <div className="flex items-center justify-between relative">
                            <div className="absolute top-4 left-0 right-0 mx-auto h-1 bg-gray-200 z-0">
                                <div
                                    className={`h-full bg-blue-600 transition-all duration-300 ease-in-out ${
                                        section === "cart" ? "w-0" : section === "address" ? "w-1/2" : "w-full"
                                    }`}
                                ></div>
                            </div>

                            <div className="flex flex-col items-center z-10">
                                <div
                                    className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                                        section === "cart"
                                            ? "bg-blue-600 text-white"
                                            : section === "address" || section === "payment"
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-200 text-gray-600"
                                    }`}
                                >
                                    1
                                </div>
                                <p
                                    className={`mt-2 text-sm font-medium ${
                                        section === "cart" ? "text-blue-600" : "text-gray-600"
                                    }`}
                                >
                                    Cart
                                </p>
                            </div>

                            <div className="flex flex-col items-center z-10">
                                <div
                                    className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                                        section === "address"
                                            ? "bg-blue-600 text-white"
                                            : section === "payment"
                                            ? "bg-green-500 text-white"
                                            : section === "cart"
                                            ? "bg-gray-200 text-gray-600"
                                            : "bg-gray-200 text-gray-600"
                                    }`}
                                >
                                    2
                                </div>
                                <p
                                    className={`mt-2 text-sm font-medium ${
                                        section === "address" ? "text-blue-600" : "text-gray-600"
                                    }`}
                                >
                                    Address
                                </p>
                            </div>

                            <div className="flex flex-col items-center z-10">
                                <div
                                    className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                                        section === "payment"
                                            ? "bg-blue-600 text-white"
                                            : section === "cart" || section === "address"
                                            ? "bg-gray-200 text-gray-600"
                                            : "bg-gray-200 text-gray-600"
                                    }`}
                                >
                                    3
                                </div>
                                <p
                                    className={`mt-2 text-sm font-medium ${
                                        section === "payment" ? "text-blue-600" : "text-gray-600"
                                    }`}
                                >
                                    Payment
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {cartView === "cart" && (
                    <CartSection
                        setSection={setSection}
                        setCartView={setCartView}
                        setCartId={setCartId}
                        setCartCount={setCartCount}
                    />
                )}

                {cartView === "address" && (
                    <AddressSection setSection={setSection} cartId={cartId} setCartView={setCartView} />
                )}
                {cartView === "payment" && <PaymentSection setSection={setSection} cartId={cartId} setCartId={setCartId} />}
            </div>
            <Footer />
        </>
    );
};

export default CartPage;
