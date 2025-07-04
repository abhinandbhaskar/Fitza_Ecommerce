import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { safe } from "../../../../utils/safeAccess";
const FeedBackSection = () => {
    const { accessToken } = useSelector((state) => state.auth);
    const [currentView, setCurrentView] = useState("seller");
    const [feedbacks, setFeedBacks] = useState([]);

    const fetchFeedBacks = async (id) => {
        console.log("OPOPOP", id);
        try {
            const response = await axios.get(`https://127.0.0.1:8000/api/admin/seller_feedbacks/${id}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            console.log(response);
            console.log("OPOPOP", response.data);
            setFeedBacks(response.data);
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    useEffect(() => {
        const id = 0;
        fetchFeedBacks(id);
    }, []);

    const handleSellerFeedback = () => {
        setCurrentView("seller");
        const id = 0;
        fetchFeedBacks(id);
    };

    const handleUserFeedback = () => {
        setCurrentView("user");
        const id = 1;
        fetchFeedBacks(id);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    Dashboard &gt; <span className="text-indigo-600">FeedBacks</span>
                </h1>
            </div>

            <div className="py-6 px-6">
                <div className="flex gap-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <button
                        onClick={() => handleSellerFeedback()}
                        className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                    >
                        Seller Feedback
                    </button>
                    <button
                        onClick={() => handleUserFeedback()}
                        className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                    >
                        User Feedback About Seller
                    </button>
                </div>
            </div>

            <div>
                <div className="p-2">
                    <h3 className="text-blue-600 font-bold">
                        {currentView === "seller" ? (
                            <span className="text-red-600 font-bold">Seller FeedBack</span>
                        ) : (
                            " User FeedBack About Seller"
                        )}
                    </h3>
                </div>
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th>FeedBack ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Rating</th>
                            <th>Comment</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((feedback, key) => (
                            <tr key="" className="hover:bg-gray-100 transition duration-200">
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">{key + 1}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    {safe(feedback, "user.first_name")}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    {safe(feedback, "user.email")}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    {safe(feedback, "rating")}
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    {safe(feedback, "comment")}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    {safe(feedback, "created_at")
                                        ? new Date(safe(feedback, "created_at")).toLocaleString()
                                        : "N/A"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FeedBackSection;
