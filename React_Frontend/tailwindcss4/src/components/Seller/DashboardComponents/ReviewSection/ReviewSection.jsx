import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

const ReviewSection = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md py-4 px-6">
        <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
          Dashboard &gt; <span className="text-indigo-600">Review & Ratings</span>
        </h1>
      </div>
      <div className="py-6 px-6">
        <div className="flex gap-4">
          <button 
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 ${activeFilter === 'all' ? 'bg-indigo-600' : 'bg-indigo-500'} text-white font-medium rounded-lg hover:bg-indigo-600`}
          >
            All 
          </button>
          <button 
            onClick={() => handleFilterChange('high')}
            className={`px-4 py-2 ${activeFilter === 'high' ? 'bg-green-600' : 'bg-green-500'} text-white font-medium rounded-lg hover:bg-green-600`}
          >
            High Rating Products
          </button>
          <button 
            onClick={() => handleFilterChange('low')}
            className={`px-4 py-2 ${activeFilter === 'low' ? 'bg-red-600' : 'bg-red-500'} text-white font-medium rounded-lg hover:bg-red-600`}
          >
            Low Rating Products
          </button>
        </div>
      </div>
      <div className="overflow-x-auto px-6">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Rating</th>
              <th className="px-4 py-3 text-left">Review</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Reviewer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((value, key) => (
                <tr key={value.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{value.id}</td>
                  <td className="px-4 py-3">
                    <img
                      src={"https://127.0.0.1:8000" + value.main_image}
                      className="w-12 h-12 rounded-full"
                      alt={value.product_name}
                    />
                  </td>
                  <td className="px-4 py-3">{value.product_name}</td>
                  <td className="px-4 py-3">{value.rating}</td>
                  <td className="px-4 py-3">{value.review_content}</td>
                  <td className="px-4 py-3"> 
                    {format(new Date(value.updated_at), "MMMM d, yyyy 'at' h:mm a")}
                  </td>
                  <td className="px-4 py-3">{value.user.first_name}</td>
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