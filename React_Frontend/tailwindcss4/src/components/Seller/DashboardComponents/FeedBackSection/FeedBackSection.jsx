import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { safe } from "../../../../utils/safeAccess";
import { toast } from "react-toastify"; // For showing error messages
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const FeedBackSection = ({setCurrentView}) => {
    const { accessToken } = useSelector((state) => state.auth);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [feedbacks, setFeedBacks] = useState([]);
    const [currentView1, setcurrentView1] = useState("feedback");

    const handleRating = (star) => {
        setRating(star);
    };

    const handleSubmit = async () => {
        const formData = {
            rating,
            feedback,
        };
        console.log(formData);

        try {
            const response = await axios.post(`https://127.0.0.1:8000/api/seller/add_seller_feedback/`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response.data);
            // alert(response.data.message);
            toast.success("Feedback Added Successfully..");
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
            console.log(error);
            console.log(error.response.data);
            toast.error("Error submitting feedback");
        }
    };

    const fetchFeedBacks = async () => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/seller/view_user_feedbacks/", {
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
        fetchFeedBacks();
    }, []);

    const renderRatingStars = (rating) => {
        const numericRating = parseFloat(rating);
        const fullStars = Math.floor(numericRating);
        const hasHalfStar = numericRating % 1 >= 0.5;

        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => {
                    if (i < fullStars) {
                        return (
                            <span key={i} className="text-yellow-400">
                                ★
                            </span>
                        );
                    } else if (i === fullStars && hasHalfStar) {
                        return (
                            <span key={i} className="text-yellow-400">
                                ½
                            </span>
                        );
                    }
                    return (
                        <span key={i} className="text-gray-300">
                            ★
                        </span>
                    );
                })}
                <span className="ml-1 text-sm text-gray-600">({rating})</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 onClick={()=>setCurrentView("mainsection")} className="text-lg md:text-2xl font-semibold text-gray-700">
                    Dashboard&gt; <span className="text-indigo-600">FeedBacks</span>
                </h1>
            </div>
            <div className="py-6 px-6">
                <div className="flex gap-4">
                    <button
                        onClick={() => setcurrentView1("feedback")}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        User Feedbacks
                    </button>
                    <button
                        onClick={() => setcurrentView1("send")}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Send Feedback to Admin
                    </button>
                </div>
            </div>
            {currentView1 === "feedback" && (
                <div className="p-6">
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <table className="min-w-full border-collapse border border-gray-200">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>rating</th>
                                    <th>Feedback</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedbacks.map((feedback, key) => (
                                    <tr className="hover:bg-gray-100 transition duration-200">
                                        <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                            {key + 1}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                            {safe(feedback, "user.first_name")}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                            {safe(feedback, "user.email")}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                            {renderRatingStars(feedback.rating)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 font-semibold border-b border-gray-300">
                                            {safe(feedback, "comment")}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 font-semibold border-b border-gray-300">
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
            )}

            {currentView1 === "send" && (
                <div className="mt-8 p-6 bg-white shadow-md rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Provide Your Feedback</h2>

                    {/* Feedback Textarea */}
                    <textarea
                        placeholder="Write your feedback here..."
                        className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    ></textarea>

                    {/* Rating Section */}
                    <h3 className="font-semibold text-gray-800 mb-3">Rate Your Experience</h3>
                    <div className="flex space-x-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                onClick={() => handleRating(star)}
                                xmlns="http://www.w3.org/2000/svg"
                                fill={star <= rating ? "gold" : "none"}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                className={`w-8 h-8 cursor-pointer transition-transform transform hover:scale-125 ${
                                    star <= rating ? "text-yellow-500" : "text-gray-400"
                                }`}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                />
                            </svg>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={() => handleSubmit()}
                        className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                    >
                        Submit Feedback
                    </button>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default FeedBackSection;
