import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
const FeedBackSection = () => {
    const {accessToken}=useSelector((state)=>state.auth);
    const [currentView,setCurrentView]=useState("seller");
    const [feedbacks,setFeedBacks]=useState([]);

    const fetchFeedBacks=async(id)=>{
        console.log("OPOPOP",id);
        try{

            const response=await axios.get(`https://127.0.0.1:8000/api/admin/seller_feedbacks/${id}/`,{
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type":"application/json",
                }
            });
            console.log(response);
            console.log("OPOPOP",response.data);
            setFeedBacks(response.data);

        }
        catch(errors)
        {
            console.log(errors);
            console.log(errors.response.data);
        }
    }

  

useEffect(()=>{
    const id=0;
    fetchFeedBacks(id);
},[])

const handleSellerFeedback=()=>{
    setCurrentView("seller");
    const id=0;
    fetchFeedBacks(id);

}

const handleUserFeedback=()=>{
    setCurrentView("user");
    const id=1;
    fetchFeedBacks(id);
}


    
  return (
    <div className="min-h-screen bg-gray-50">
    <div className="bg-white shadow-md py-4 px-6">
      <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
        Dashboard &gt; <span className="text-indigo-600">FeedBacks</span>
      </h1>
    </div>
    
    <div className="py-6 px-6">
        <div className="flex gap-4">
          <button onClick={()=>handleSellerFeedback()} className="px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600">
            Seller FeedBack
          </button>
          <button onClick={()=>handleUserFeedback()} className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600">
           User FeedBack About Seller
          </button>
        </div>
      </div>

        <div>
        <h3 className='text-blue-600'>{currentView==="seller"?<span className='text-red-600'>Seller FeedBack</span>:(" User FeedBack About Seller")}</h3>
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

                            {
                                feedbacks.map((feedback,key)=>(
                                    <tr key="" className="hover:bg-gray-100 transition duration-200">
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                        {feedback.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                        {feedback.user.first_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                        {feedback.user.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                        {feedback.rating}
                                    </td>
                  
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                        {feedback.comment}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                        {feedback.created_at}
                                    </td>
                                   
                                  
                                </tr>

                                ))
                            }
                            
                        
                        </tbody>
      </table>
    </div>

      


{/* {
    currentView==="user" && (
        <div>
        <h3 className='text-red-600'>User FeedBack About Seller</h3>
    <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Account Status</th>
                            <th>Registration Date</th>
                            <th>Last Login</th>
                            <th>Total Orders</th>
                        
                        </tr>
                    </thead>
                        <tbody>
                            
                          
                                <tr key="" className="hover:bg-gray-100 transition duration-200">
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    users
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    full_name
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    email
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    phone
                                </td>
              
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    date_joined
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    users.last_login
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    7
                                </td>
                              
                            </tr>
                        
                        </tbody>
      </table>
    </div>

      
    )
} */}
    </div>
  )
}

export default FeedBackSection
