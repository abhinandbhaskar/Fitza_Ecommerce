import React, { useEffect, useState } from 'react';
import profile from "../../../../assets/profile.jpg";
import PerformanceMetrics from '../PerformanceMetrics/PerformanceMetrics';
import OrderOverview from '../OrderOverview/OrderOverview';
import InventoryManagement from '../InventoryManagement/InventoryManagement';
import { useSelector } from 'react-redux';
import axios from 'axios';
const MainSection = () => {
      const { accessToken } = useSelector((state) => state.auth);
      const [users,setUsers]=useState(0);
      const [products,setProducts]=useState(0);
      const [orders,setOrders]=useState(0);
      const [sales,setSales]=useState(0);
      const [earnings,setEarnings]=useState(0);
      const [reviews,setReviews]=useState(0);
      
      const [salesData, setSalesData] = useState([]);
      const [revenueData, setRevenueData] = useState([]);
      const [topProductsData, setTopProductsData] = useState([]);
    
      const fetchDashBoardData = async () => {
        try {
          const response = await axios.get("https://127.0.0.1:8000/api/seller/fetch_seller_dashboard/", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            }
          });
          console.log("Yes",response.data);
          console.log("Yesdata",response.data.data.totalusers);
          setUsers(response.data.data.totalusers);
          setProducts(response.data.data.totalproducts);
          setOrders(response.data.data.totalorders);
          setSales(response.data.data.total_sales);
          setEarnings(response.data.data.totalearnings);
          setReviews(response.data.data.totalreviews);

          
          // Set dashboard counts
          
        } catch (errors) {
          console.log("err", errors);
        }
      }

    useEffect(()=>{
    fetchDashBoardData();
    },[]);
    
    

  return (
    <>
    {/* Header Section */}
    <div className="bg-amber-50 rounded-lg shadow-md mb-4 overflow-hidden">
    {/* Header */}
    <div className="bg-white border-b border-gray-200 flex items-center px-4 py-3 md:px-6 md:py-4">
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">Dashboard &gt;</h1>
    </div>

    {/* Stats Section */}
    <div className="bg-gray-50 p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
                { 
                    title: "Total Users", 
                    count: users, 
                    bgColor: "bg-green-500",
                    icon: (
                        <svg className="w-8 h-8 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    )
                },
                { 
                    title: "Total Products", 
                    count: products, 
                    bgColor: "bg-pink-500",
                    icon: (
                        <svg className="w-8 h-8 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    )
                },
                { 
                    title: "Total Orders", 
                    count: orders, 
                    bgColor: "bg-violet-500",
                    icon: (
                        <svg className="w-8 h-8 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    )
                },
                { 
                    title: "Total Sales", 
                    count: sales, 
                    bgColor: "bg-blue-500",
                    icon: (
                        <svg className="w-8 h-8 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    )
                },
                { 
                    title: "Total Earnings", 
                    count: earnings, 
                    bgColor: "bg-yellow-500",
                    icon: (
                        <svg className="w-8 h-8 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                },
                { 
                    title: "Total Reviews", 
                    count: reviews, 
                    bgColor: "bg-red-500",
                    icon: (
                        <svg className="w-8 h-8 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    )
                },
            ].map((stat, index) => (
                <div
                    key={index}
                    className={`h-40 flex flex-col justify-between p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${stat.bgColor}`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white text-opacity-90 text-sm font-medium uppercase tracking-wider">
                                {stat.title}
                            </p>
                            <h3 className="text-white text-3xl font-bold mt-1">
                                {stat.count}
                            </h3>
                        </div>
                        {stat.icon}
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white text-opacity-70 text-xs font-medium">
                            Updated today
                        </span>
                        <button className="text-white text-opacity-90 hover:text-opacity-100 text-xs font-semibold focus:outline-none">
                            View details →
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
</div>

    <PerformanceMetrics/>
    <OrderOverview/>
    <InventoryManagement/>
</>
  )
}

export default MainSection
