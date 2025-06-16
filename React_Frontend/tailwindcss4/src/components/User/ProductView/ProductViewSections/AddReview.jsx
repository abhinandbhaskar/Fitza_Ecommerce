import React,{useEffect, useState} from 'react'
import axios from "axios";
import { format } from "date-fns";
import { safe } from '../../../../utils/safeAccess';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
    const AddReview = ({product}) => {
        const [rating, setRating] = useState(0);
        const [description,setDescription]=useState("");
        const {accessToken}=useSelector((state)=>state.auth);
        const [reviews,setReviews]=useState([]);

        const SubmitReview=async()=>{

          const fetchData={
            "id":product.id,
            "rating":rating,
            "description":description
          }
          console.log("DA",fetchData);
       
          try{
            const response=await axios.post("https://127.0.0.1:8000/api/add_review_rating/",fetchData,{
              headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${accessToken}`,
              }
            });
            console.log(response);
            console.log(response.data);
            toast.success("Review Added Successfully");
            fetchReview();
          }catch(errors){
            console.log(errors);
            console.log(errors.response.data);
            toast.error("Failed to add review..");
          }

        }
        const handleRating = (value) => {
            setRating(value);
            console.log("Rating Value", rating + 1);
        };

        const fetchReview=async()=>{
            const product_id=product.id;
            try{
                const response=await axios.get(`https://127.0.0.1:8000/api/view_rating/${product_id}/`,{
                    headers:{
                        Authorization:`Bearer ${accessToken}`,
                    }
                });
                console.log(response);
                console.log("Kitti",response.data[0]);
                setReviews(safe(response,'data'));
            }catch(errors)
            {
                console.log(errors);
                console.log(errors.response.data);
            }

        }

        useEffect(()=>{
            fetchReview();
        },[])
        return (
            <div className="p-4 border border-gray-400 rounded-lg">
                <div className="space-y-6">
                {
  reviews && reviews.length > 0 ? (
    reviews.map((rev, index) => (
      <div className="flex items-center space-x-4" key={index}>
        <img
            src={"https://127.0.0.1:8000" + safe(rev,'user.userphoto')}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h6 className="font-bold">{safe(rev,'user.first_name')}</h6>
          <p className="text-sm">{safe(rev,'review_content')}</p>
          <span className="text-xs text-gray-500">
            {format(new Date(safe(rev,'updated_at')), "MMMM d, yyyy 'at' h:mm a")}
          </span>
        </div>
      </div>
    ))
  ) : (
    <div>
      <p>Loading...</p>
    </div>
  )
}

                </div>
                <div className="mt-8 p-6 bg-gray-50 shadow-lg rounded-lg">
                    <h4 className="font-bold text-lg mb-4 text-gray-700">Add a Review</h4>
                    <textarea
                        placeholder="Write your comment..."
                        className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={description}
                        onChange={(e)=>setDescription(e.target.value)}
                    ></textarea>
                    <div className="mt-6">
                        <h4 className="font-bold text-lg mb-4 text-gray-700">Add a Rating</h4>
                        <div className="flex space-x-2">
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
                    </div>
                    <button onClick={()=>SubmitReview()} className="mt-6 w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300">
                        Submit Review
                    </button>
                </div>
                <ToastContainer/>
            </div>
        );
    };

export default AddReview

