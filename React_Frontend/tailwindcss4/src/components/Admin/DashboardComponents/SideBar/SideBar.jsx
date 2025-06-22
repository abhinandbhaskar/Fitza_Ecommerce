import React from 'react';
import "./SideBar.css";
import dashboardicon from "../../../../assets/dashboard.png";

const SideBar = ({setCurrentView}) => {
  return (
    <div className="main-bg h-auto w-1/5 text-white shadow-lg fixed top-20">

      <div className="mt-4">
        <button onClick={()=>setCurrentView("mainsection")} className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
          <img src={dashboardicon} className="h-6 w-6 mr-4" alt="" />
          <span className="flex-1">Dashboard</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button onClick={()=>setCurrentView("users")} className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
          <i className="fa-solid fa-users mr-4"></i>
          <span className="flex-1">Users</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button onClick={()=>setCurrentView("sellers")} className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
          <i className="fa-solid fa-users-between-lines mr-4"></i>
          <span className="flex-1">Sellers</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button onClick={()=>setCurrentView("products")} className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
          <i className="fa-solid fa-shirt mr-4"></i>
          <span className="flex-1">Products</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button onClick={()=>setCurrentView("orders")} className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
         
          <i class="fa-solid fa-cart-shopping mr-4"></i>
          <span className="flex-1">Orders</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button onClick={()=>setCurrentView("revenue")} className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
          <i className="fa-solid fa-money-bill-trend-up mr-4"></i>
          <span className="flex-1">Revenue</span>
          <span className="text-gray-400">&gt;</span>
        </button>
      
        <button onClick={()=>setCurrentView("complaints")} className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
          <i className="fa-solid fa-rectangle-list mr-4"></i>
          <span className="flex-1">Complaints</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button onClick={()=>setCurrentView("reviews")} className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
          <i className="fa-solid fa-star mr-4"></i>
          <span className="flex-1">Reviews</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button onClick={()=>setCurrentView("feedback")} className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
        <i className="fa-solid fa-message mr-4"></i>
          <span className="flex-1">FeedBacks</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button onClick={()=>setCurrentView("returnrefund")}  className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
          <i className="fa-solid fa-right-left mr-4"></i>
          <span className="flex-1">Refund & Returns</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button onClick={()=>setCurrentView("banner")} className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
          <i class="fa-solid fa-rectangle-ad"></i>
          <span className="flex-1">Banner & Promotions</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button onClick={()=>setCurrentView("discounts")} className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
          <i class="fa-solid fa-tags"></i>
          <span className="flex-1">Discounts & Offers</span>
          <span className="text-gray-400">&gt;</span>
        </button>

      </div>
    </div>
  );
};

export default SideBar;
