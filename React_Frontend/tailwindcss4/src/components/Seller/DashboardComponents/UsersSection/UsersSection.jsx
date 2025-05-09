import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
const UsersSection = () => {
    const {accessToken}=useSelector((state)=>state.auth);
    const [users,setUsers]=useState([]);
    const fetchOrderedUsers=async()=>{

        try{
            const response=await axios.get("https://127.0.0.1:8000/api/seller/view_ordered_users/",{
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type":"application/json",
                }
            });
            console.log("[][]",response.data);
            setUsers(response.data);
        }catch(errors)
        {
            console.log(errors);
            console.log(errors.response.data);
        }

    }

    useEffect(()=>{
        fetchOrderedUsers();
    },[])

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    Dashboard&gt; <span className="text-indigo-600">Users</span>
                </h1>
            </div>
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    <span className="text-red-600"> Our Products Ordered Users</span>
                </h1>
            </div>

            {/* Table Container */}
            <div className="p-6">
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>OrderDate</th>
                            <th>Total Orders</th>
                        </tr>
                    </thead>
                        <tbody>
                            {
                                users.map((user,key)=>(
                                    <tr className="hover:bg-gray-100 transition duration-200">
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                        {key+1}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                        {user.FullName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                        {user.Email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    {user.Phone}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 font-semibold border-b border-gray-300">
                                        {user.OrderDate}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                        {user.TotalOrders}
                                    </td>
                                    
                                </tr>
                                ))
                            }

                            {/* Add more rows as needed */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersSection;

