import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { safe } from "../../../../utils/safeAccess";
const ReviewSection = ({ setCurrentView }) => {
    const { accessToken } = useSelector((state) => state.auth);
    const [reviews, setReviews] = useState([]);
    const [filterstatus, setFilterStatus] = useState("all");

    const fetchAllReview = async () => {
        try {
            const response = await axios.get(`https://127.0.0.1:8000/api/admin/view_review_ratings/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log("fetchhhhh",response.data);
            setReviews(response.data);
        } catch (errors) {
            console.error(errors);
            if (errors.response) {
                console.error(errors.response.data);
            }
        }
    };

    useEffect(() => {
        fetchAllReview();
        console.log("HH", filterstatus);
    }, [filterstatus]);

    const Approve = async (id) => {
        console.log(id);
        try {
            const response = await axios.post(
                `https://127.0.0.1:8000/api/admin/approve_review/${id}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log(response);
            console.log(response.data);
            alert("Review Approved Successfully...")
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    const Reject = async (id) => {
     
        console.log(id);
        try {
            const response = await axios.post(
                `https://127.0.0.1:8000/api/admin/reject_review/${id}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log(response);
            console.log(response.data);
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    useEffect(() => {
        console.log("Po", filterstatus);
    }, [filterstatus]);

    const RejectReview=(id)=>{

      if(window.confirm("do you want to reject?"))
      {
        Reject(id)
      }

    }

    
    const renderRatingStars = (rating) => {
        const numericRating = parseFloat(rating);
        const fullStars = Math.floor(numericRating);
        const hasHalfStar = numericRating % 1 >= 0.5;
        
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => {
                    if (i < fullStars) {
                        return <span key={i} className="text-yellow-400">★</span>;
                    } else if (i === fullStars && hasHalfStar) {
                        return <span key={i} className="text-yellow-400">½</span>;
                    }
                    return <span key={i} className="text-gray-300">★</span>;
                })}
                <span className="ml-1 text-sm text-gray-600">({rating})</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-md py-4 px-6">
                <h1
                    onClick={() => setCurrentView("mainsection")}
                    className="text-lg md:text-2xl font-semibold text-gray-700 hover:text-gray-800"
                >
                    Dashboard &gt; <span className="text-indigo-600">Review & Ratings</span>
                </h1>
            </div>

            <div className="py-6 px-6">
<div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
    <button
        onClick={() => setFilterStatus("all")}
        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
    >
        All Reviews
    </button>
    <button
        onClick={() => setFilterStatus("pending")}
        className="px-4 py-2  bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
    >
        Pending
    </button>
    <button
        onClick={() => setFilterStatus("approved")}
        className="px-4 py-2  bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
    >
        Approved
    </button>
    <button
        onClick={() => setFilterStatus("rejected")}
        className="px-4 py-2  bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
    >
        Rejected
    </button>
</div>
            </div>

            <div className="overflow-x-auto px-6">
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 text-left">No.</th>
                            <th className="px-4 py-3 text-left">Shop Name</th>
                            <th className="px-4 py-3 text-left">Product</th>
                            <th className="px-4 py-3 text-left">Rating</th>
                            <th className="px-4 py-3 text-left">Review</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Submitted By</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {reviews
                            .filter((item) => (filterstatus === "all" ? item : item.status === filterstatus))
                            .map((review, key) => (
                                <tr key={key} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{key + 1}</td>
                                    <td className="px-4 py-3">{safe(review,'shop_name')}</td>
                                    <td className="px-4 py-3">{safe(review,'product.product_name')}</td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                            {renderRatingStars(review.rating)}
                                        </td>
                                   
                                    <td className="px-4 py-3">{safe(review,'review_content')}</td>
                                    <td className="px-4 py-3">
                                        {" "}
                                        {format(new Date(review.updated_at), "MMMM d, yyyy 'at' h:mm a")}
                                    </td>
                                    <td className="px-4 py-3">{safe(review,'user.first_name')}</td>
                                    <td className="px-4 py-3 flex justify-center gap-2">
                                        <button
                                            onClick={() => Approve(review.id)}
                                            className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => RejectReview(review.id)}
                                            className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReviewSection;


