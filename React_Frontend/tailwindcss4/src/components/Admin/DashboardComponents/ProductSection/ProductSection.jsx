import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import AllProducts from "./ProductSectionComponents/AllProducts/AllProducts";
import PendingApprovals from "./ProductSectionComponents/PendingApprovals/PendingApprovals";
import Categories from "./ProductSectionComponents/Categories/Categories";
import ProductsInsights from "./ProductSectionComponents/ProductsInsights/ProductsInsights";
import ProductAttributes from "./ProductSectionComponents/ProductAttributes/ProductAttributes";

const ProductSection = ({ searchTerm, setCurrentView }) => {
    const [newCurrentView, setnewCurrentView] = useState("mainsection");
    const [viewall, setallView] = useState(true);
    const data = [
        { name: "Category A", sales: 400 },
        { name: "Category B", sales: 300 },
        { name: "Category C", sales: 200 },
        { name: "Category D", sales: 278 },
        { name: "Category E", sales: 189 },
    ];

    useEffect(() => {
        if (searchTerm) {
            setnewCurrentView("allproducts");
        }
    }, [searchTerm]);

    const panelSection = () => {
        setnewCurrentView("allproducts");
        setallView(true);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Breadcrumb */}
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1
                    onClick={() => setCurrentView("mainsection")}
                    className="text-lg md:text-2xl font-semibold text-gray-700 hover:text-gray-800"
                >
                    Dashboard &gt; <span className="text-indigo-600">Products</span>
                </h1>
            </div>

            {/* Navigation Buttons */}
            <div className="w-full max-w-7xl mx-auto mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 p-6 bg-gray-50 rounded-lg">
                    <button
                        onClick={() => panelSection()}
                        className="flex flex-col items-start p-5 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200"
                    >
                        <div className="p-3 mb-3 bg-blue-100 rounded-full">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">All Products</h3>
                        <p className="mt-1 text-sm text-gray-500">Manage existing product listings</p>
                    </button>

                    <button
                        onClick={() => setnewCurrentView("pending")}
                        className="flex flex-col items-start p-5 bg-white rounded-lg border border-gray-200 hover:border-yellow-500 hover:shadow-md transition-all duration-200"
                    >
                        <div className="p-3 mb-3 bg-yellow-100 rounded-full">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Pending Approvals</h3>
                        <p className="mt-1 text-sm text-gray-500">Review new submissions</p>
                    </button>

                    <button
                        onClick={() => setnewCurrentView("categories")}
                        className="flex flex-col items-start p-5 bg-white rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all duration-200"
                    >
                        <div className="p-3 mb-3 bg-green-100 rounded-full">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Categories</h3>
                        <p className="mt-1 text-sm text-gray-500">Organize product taxonomy</p>
                    </button>

                    <button
                        onClick={() => setnewCurrentView("mainsection")}
                        className="flex flex-col items-start p-5 bg-white rounded-lg border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all duration-200"
                    >
                        <div className="p-3 mb-3 bg-purple-100 rounded-full">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Product Insights</h3>
                        <p className="mt-1 text-sm text-gray-500">Performance analytics</p>
                    </button>

                    <button
                        onClick={() => setnewCurrentView("attribute")}
                        className="flex flex-col items-start p-5 bg-white rounded-lg border border-gray-200 hover:border-gray-500 hover:shadow-md transition-all duration-200"
                    >
                        <div className="p-3 mb-3 bg-gray-100 rounded-full">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Attributes</h3>
                        <p className="mt-1 text-sm text-gray-500">Manage product variants</p>
                    </button>
                </div>
            </div>

            {newCurrentView === "mainsection" && <ProductsInsights />}
            {newCurrentView === "allproducts" && (
                <AllProducts
                    searchTerm={searchTerm}
                    setnewCurrentView={setnewCurrentView}
                    viewall={viewall}
                    setallView={setallView}
                />
            )}
            {newCurrentView === "pending" && <PendingApprovals />}
            {newCurrentView === "categories" && <Categories />}
            {newCurrentView === "insights" && <ProductsInsights />}
            {newCurrentView === "attribute" && <ProductAttributes />}
        </div>
    );
};

export default ProductSection;
