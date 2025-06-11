import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SellerSection = () => {
    const { accessToken } = useSelector((state) => state.auth);
    const [sellers, setSellers] = useState([]);
    const [filteredSellers, setFilteredSellers] = useState([]);
    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState("approved");
    const [seller, setSeller] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchSellers = async () => {
        try {
            const response = await fetch("https://127.0.0.1:8000/api/admin/view_sellers/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Grrook", data);
                setSellers(data);
                setFilteredSellers(data); // Initialize filtered sellers with all sellers
            }
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        } finally {
            console.log("Completed....");
            setLoading("approved");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentView === "approved") {
            ourSellers();
        }
    }, []);

    useEffect(() => {
        // Filter sellers whenever searchTerm changes
        if (searchTerm.trim() === "") {
            setFilteredSellers(sellers);
        } else {
            const filtered = sellers.filter(seller => {
                const sellerName = `${seller.user.first_name} ${seller.user.last_name}`.toLowerCase();
                const shopName = seller.shop_name.toLowerCase();
                const search = searchTerm.toLowerCase();
                return sellerName.includes(search) || shopName.includes(search);
            });
            setFilteredSellers(filtered);
        }
    }, [searchTerm, sellers]);

    const ourSellers = () => {
        setCurrentView("approved");
        fetchSellers();
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // ... (keep all your other existing functions the same)

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    Dashboard &gt; <span className="text-indigo-600">Seller</span>
                </h1>
            </div>
            
            {/* Search Input */}
            <div className="p-4 bg-white shadow-md">
                <div className="max-w-md mx-auto">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                        Search Sellers
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="search"
                            placeholder="Enter seller name or shop name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                        ✕
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            {/* ... (keep the rest of your JSX the same, but replace sellers with filteredSellers in the table rendering) */}

            {currentView === "approved" && (
                <div className="w-full bg-white shadow-md py-4 px-6">
                    <h1 className="p-2 text-blue-700 font-bold text-sm">
                        Our Sellers {searchTerm && `(Filtered: ${filteredSellers.length} found)`}
                    </h1>
                </div>
            )}

            {/* Table Container */}
            <div className="p-6">
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    {loading ? (
                        <p className="text-center text-gray-600 py-4">Loading users...</p>
                    ) : (
                        <table className="min-w-full border-collapse border border-gray-200">
                            <thead>
                                <tr>
                                    <th>Seller ID</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Shop Name</th>
                                    <th>Registration Date</th>
                                    <th>View Profile</th>
                                    <th>Account Status</th>
                                    {currentView === "approved" ? (<></>) : (<th>Approve Seller</th>)}
                                    <th>Remove Seller</th>
                                </tr>
                            </thead>
                            {currentView === "approved" && (
                                <tbody>
                                    {filteredSellers.length > 0 ? (
                                        filteredSellers.map((seller) => (
                                           <tr>
                                            <td>{seller.id}</td>
                                           </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="9"
                                                className="text-center px-6 py-4 text-sm text-gray-600 border-b border-gray-300"
                                            >
                                                {searchTerm ? "No matching sellers found." : "No sellers found."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            )}
                        </table>
                    )}

                    {/* ... (keep the rest of your JSX the same) */}
                </div>
            </div>
        </div>
    );
};

export default SellerSection;
