import React from 'react'
import profile from "../../../../assets/profile.jpg";
import PerformanceMetrics from '../PerformanceMetrics/PerformanceMetrics';
import OrderOverview from '../OrderOverview/OrderOverview';
import InventoryManagement from '../InventoryManagement/InventoryManagement';
const MainSection = () => {
  return (
    <>
    {/* Header Section */}
    <div className="bg-amber-500 rounded-lg shadow-md mb-4">
        <div className="bg-white border border-gray-300 flex items-center px-6 py-3 rounded-t-lg">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard &gt;</h1>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-800 p-4 flex gap-4 rounded-b-lg">
            <div className="grid grid-cols-3 gap-4 flex-grow">
                {[
                    { title: "Total Users", count: 277, bgColor: "bg-green-500" },
                    { title: "Total Sellers", count: 277, bgColor: "bg-pink-500" },
                    { title: "Total Orders", count: 277, bgColor: "bg-violet-500" },
                    { title: "Total Products", count: 277, bgColor: "bg-blue-500" },
                    { title: "Total Revenue", count: 277, bgColor: "bg-yellow-500" },
                    { title: "Total Reviews", count: 277, bgColor: "bg-red-500" },
                ].map((stat, index) => (
                    <div
                        key={index}
                        className={`h-40 flex flex-col items-start justify-center p-4 rounded-2xl shadow-md ${stat.bgColor}`}
                    >
                        <h1 className="text-white text-lg font-semibold">{stat.title}</h1>
                        <h3 className="text-white text-3xl font-bold">{stat.count}</h3>
                    </div>
                ))}
            </div>

            <div className="w-1/4 bg-orange-300 rounded-2xl shadow-md flex items-center justify-center text-xl font-semibold text-gray-700">
                Total Sales
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
