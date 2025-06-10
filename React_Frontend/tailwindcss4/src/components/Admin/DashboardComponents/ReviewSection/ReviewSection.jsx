import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
const ReviewSection = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [filterstatus,setFilterStatus]=useState("all");

  const fetchAllReview = async () => {
    try {
      const response = await axios.get(`https://127.0.0.1:8000/api/admin/view_review_ratings/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response);
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
    console.log("HH",filterstatus);
  }, []);

  const Approve=async(id)=>{
    console.log(id);
        try{
          const response=await axios.post(`https://127.0.0.1:8000/api/admin/approve_review/${id}/`,{},{
            headers:{
              Authorization:`Bearer ${accessToken}`,
            }
          });
          console.log(response);
          console.log(response.data);
        }catch(errors){
          console.log(errors);
          console.log(errors.response.data);
        }
      }


  const Reject=async(id)=>{
console.log(id);
    try{
      const response=await axios.post(`https://127.0.0.1:8000/api/admin/reject_review/${id}/`,{},{
        headers:{
          Authorization:`Bearer ${accessToken}`,
        }
      });
      console.log(response);
      console.log(response.data);
    }catch(errors){
      console.log(errors);
      console.log(errors.response.data);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md py-4 px-6">
        <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
          Dashboard &gt; <span className="text-indigo-600">Review & Ratings</span>
        </h1>
      </div>

      <div className="py-6 px-6">
        <div className="flex gap-4">
          <button onClick={()=>setFilterStatus("all")} className="px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600">
            All Reviews
          </button>
            <button onClick={()=>setFilterStatus("pending")} className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-indigo-600">
            Pending
          </button>
          <button onClick={()=>setFilterStatus("approved")} className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600">
            Approved
          </button>
          <button onClick={()=>setFilterStatus("rejected")} className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600">
            Rejected
          </button>
        </div>
      </div>

      <div className="overflow-x-auto px-6">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
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
            {reviews.map((review, key) => (
              <tr key={key} className="hover:bg-gray-50">
                <td className="px-4 py-3">{key + 1}</td>
                <td className="px-4 py-3">{review.shop_name}</td>
                <td className="px-4 py-3">{review.product}</td>
                <td className="px-4 py-3">{review.rating}</td>
                <td className="px-4 py-3">{review.review_content}</td>
                <td className="px-4 py-3"> {format(new Date(review.updated_at), "MMMM d, yyyy 'at' h:mm a")}</td>
                <td className="px-4 py-3">{review.user.first_name}</td>
                <td className="px-4 py-3 flex justify-center gap-2">
                  <button onClick={()=>Approve(review.id)} className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600">
                    Approve
                  </button>
                  <button onClick={()=>Reject(review.id)} className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">
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
