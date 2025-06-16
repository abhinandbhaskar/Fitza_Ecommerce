import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { safe } from '../../../../utils/safeAccess';

const ReviewSection = ({setCurrentView}) => {
  const {accessToken} = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchReviews = async() => {
    try {
      const response = await axios.get("https://127.0.0.1:8000/api/seller/view_user_reviews/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      console.log(response);
      console.log("reviewratings", response.data);
      setReviews(response.data);
      setFilteredReviews(response.data); 
    } catch(errors) {
      console.log(errors);
      console.log(errors.response.data);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (activeFilter === 'high') {
      setFilteredReviews(reviews.filter(review => parseFloat(review.rating) >= 4));
    } else if (activeFilter === 'low') {
      setFilteredReviews(reviews.filter(review => parseFloat(review.rating) < 3));
    } else {
      setFilteredReviews(reviews);
    }
  }, [activeFilter, reviews]);

  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
  };


      
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
        <h1 onClick={()=>setCurrentView("mainsection")} className="text-lg md:text-2xl font-semibold text-gray-700">
          Dashboard &gt; <span className="text-indigo-600">Review & Ratings</span>
        </h1>
      </div>
      <div className="py-6 px-6">
        <div className="flex gap-4">
          <button 
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 ${activeFilter === 'all' ? 'bg-indigo-700' : 'bg-indigo-600'}  text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1`}
          >
            All 
          </button>
          <button 
            onClick={() => handleFilterChange('high')}
            className={`px-4 py-2 ${activeFilter === 'high' ? 'bg-indigo-700' : 'bg-indigo-600'}  text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1`}
          >
            High Rating Products
          </button>
          <button 
            onClick={() => handleFilterChange('low')}
            className={`px-4 py-2 ${activeFilter === 'low' ? 'bg-indigo-700' : 'bg-indigo-600'}  text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1`}
          >
            Low Rating Products
          </button>
        </div>
      </div>
      <div className="overflow-x-auto px-6">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th>No.</th>
              <th>Image</th>
              <th>Product</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Date</th>
              <th>Reviewer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((value, key) => (
                <tr key={value.id}  className="hover:bg-gray-100 transition duration-200">
                  <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">{key+1}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                    <img
                      src={"https://127.0.0.1:8000" + safe(value,'main_image')}
                      className="w-12 h-12 rounded-full"
                      alt={safe(value,'product_name')}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">{safe(value,'product_name')}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                
                     {renderRatingStars(value.rating)}
                    </td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">{safe(value,'review_content')}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300"> 
                    {format(new Date(safe(value,'updated_at')), "MMMM d, yyyy 'at' h:mm a")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">{safe(value,'user.first_name')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                  No reviews found for this filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ReviewSection