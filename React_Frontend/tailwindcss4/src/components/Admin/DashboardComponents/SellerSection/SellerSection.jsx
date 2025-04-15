import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const SellerSection = () => {
    const {accessToken}=useSelector((state)=>state.auth);
    const [sellers,setSellers]=useState([]);
    const [loading,setLoading]=useState(true);
    const fetchSellers=async()=>{
        try{
            const response=await fetch("https://127.0.0.1:8000/api/admin/view_sellers/",{
                method:"GET",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                }
            });
            if(response.ok)
            {
                const data=await response.json();
                console.log(data);
                setSellers(data);
            }
        }
        catch(errors)
        {
            console.log(errors);
            console.log(errors.response.data);
        }
        finally{
            console.log("Completed....");
            setLoading(false);
            
        }
    }
    useEffect(()=>{
     fetchSellers();
    },[])
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    Dashboard &gt; <span className="text-indigo-600">Seller</span>
                </h1>
            </div>

            {/* Table Container */}
            <div className="p-6">
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            {
                loading ? (
                    <p className="text-center text-gray-600 py-4">Loading users...</p>
                ):
                (
                    <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th>Seller ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Shop Name</th>
                            <th>Registration Date</th>
                            <th>View Profile</th>
                            <th>Status</th>
                            <th>Action</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                        <tbody>

                        {
                            sellers.length > 0 ? (

                                sellers.map((sellers)=>(
                                    <tr key={sellers.id} className="hover:bg-gray-100 transition duration-200">
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                        {sellers.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                        {sellers.user.first_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                        {sellers.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                        {sellers.shop_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-green-600 font-semibold border-b border-gray-300">
                                    20/05/2025
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
                                            View
                                        </button>                                </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    Approve
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
                                            Approve User
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm border-b border-gray-300">
                                        <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200">
                                            Remove User
                                        </button>
                                    </td>
                                </tr>
                                ))

                            ):
                            (
                                <tr>
                                <td
                                    colSpan="9"
                                    className="text-center px-6 py-4 text-sm text-gray-600 border-b border-gray-300"
                                >
                                    No users found.
                                </td>
                            </tr>
                            )
                        }
                            
                        </tbody>

                    </table>
                )
            }
                </div>
            </div>
        </div>
    );
};

export default SellerSection;