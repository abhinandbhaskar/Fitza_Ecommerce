import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SellerFeedBack = ({currentView,setCurrentView,setMyOrderView}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [ssid,setSSid]=useState(null);
  const {accessToken}=useSelector((state)=>state.auth);

  const handleRating = (star) => {
    setRating(star);
  };

  const handleSubmit = async () => {
    const formData = {
      rating,
      feedback,
    };
  
    try {
      const response = await axios.post(`https://127.0.0.1:8000/api/add_shop_feedback/${ssid}/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      // alert(response.data.message);
      toast.success(response.data.message);
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      console.log(error);
      console.log(error.response.data);
      // alert("Error submitting feedback");
      toast.error("Error submitting feedback")
    }
  };
  

    useEffect(()=>{
        console.log("MAMAM",currentView.sid);
        setSSid(currentView.sid);
    },[currentView])

  return (
    <div className="h-full w-full p-6 flex flex-col bg-gray-100">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-300">
        <i className="fa-solid fa-comments text-4xl text-green-500"></i>
        <h1 className="text-3xl font-bold text-gray-800">Seller Feedback</h1>
      </div>

      {/* Breadcrumb */}
      <div className="py-2 text-gray-600 text-sm">
                <button 
        className="text-blue-500 hover:text-blue-700 hover:underline"
        onClick={() => {
            setCurrentView("myorders");
            setMyOrderView("myorder");
        }}
    >
        My Order &gt;
    </button>


        <span className="font-semibold text-green-600">Seller Feedback</span>
      </div>

      {/* Feedback Form */}
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
          onClick={handleSubmit}
          className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
        >
          Submit Feedback
        </button>
      </div>
    <ToastContainer/>
    </div>
  );
};

export default SellerFeedBack;

