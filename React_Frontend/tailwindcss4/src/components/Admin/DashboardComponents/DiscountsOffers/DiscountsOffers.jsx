import React from "react";

const DiscountsOffers = ({ setCurrentView }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1
                    onClick={() => setCurrentView("mainsection")}
                    className="text-lg md:text-2xl font-semibold text-gray-700 hover:text-gray-800"
                >
                    Dashboard &gt; <span className="text-indigo-600">Discounts & Offers</span>
                </h1>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 w-full pl-[140px] pr-[100px]">
                <div
                    key=""
                    onClick={() => setCurrentView("coupon")}
                    className="cursor-pointer bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center h-60 w-80"
                >
                    <span className="text-5xl">🎟️</span>
                    <h3 className="text-2xl font-semibold mt-4">Coupons</h3>
                    <p className="text-sm text-gray-500 text-center">Manage promo codes</p>
                </div>

                <div
                    key=""
                    onClick={() => setCurrentView("discountcard")}
                    className="cursor-pointer bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center h-60 w-80"
                >
                    <span className="text-5xl">💳</span>
                    <h3 className="text-2xl font-semibold mt-4">Discount Cards</h3>
                    <p className="text-sm text-gray-500 text-center">Create and assign cards</p>
                </div>

                <div
                    key=""
                    onClick={() => setCurrentView("freeship")}
                    className="cursor-pointer bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center h-60 w-80"
                >
                    <span className="text-5xl">🚚</span>
                    <h3 className="text-2xl font-semibold mt-4">Free Shipping</h3>
                    <p className="text-sm text-gray-500 text-center">Set shipping offers</p>
                </div>

                <div
                    key=""
                    onClick={() => setCurrentView("productoffer")}
                    className="cursor-pointer bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center h-60 w-80"
                >
                    <span className="text-5xl">🛍️</span>
                    <h3 className="text-2xl font-semibold mt-4">Product Offers</h3>
                    <p className="text-sm text-gray-500 text-center">Define product discounts</p>
                </div>
            </div>
        </div>
    );
};

export default DiscountsOffers;
