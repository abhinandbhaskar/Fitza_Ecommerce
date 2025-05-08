import React from 'react';
import "./SideBar.css"
import dashboardicon from "../../../../assets/dashboard.png";
import users from "../../../../assets/Icons/users.png"
import products from "../../../../assets/Icons/Product.png"
import orders from "../../../../assets/Icons/Products.png"
import revenue from "../../../../assets/Icons/Revenue.png"
import messages from "../../../../assets/Icons/Messages.png"
import Complaints from "../../../../assets/Icons/Complaints.png"
import reviews from "../../../../assets/Icons/Reviews.png"
import refund from "../../../../assets/Icons/Refund.png"
import promotions from "../../../../assets/Icons/Promotions.png"
import offers from "../../../../assets/Icons/Offers.png"
const SideBar = ({setCurrentView}) => {
  return (
    <div className="h-auto w-1/5 bg-gray-800 text-white shadow-lg top-20 p-1">

      <div className="mt-1 bg-gray-700 top-[100px] h-[calc(100vh-120px)] overflow-y-auto hidden-scrollbar">
        <button onClick={()=>setCurrentView("mainsection")} className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
          <img src={dashboardicon} className="h-10 w-10 mr-4" alt="" />
          <span className="flex-1">Dashboard</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button onClick={()=>setCurrentView("users")} className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
        <img src={users} className="h-10 w-10 mr-4" alt="" />
          <span className="flex-1">Users</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button onClick={()=>setCurrentView("products")} className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
        <img src={products} className="h-10 w-10 mr-4" alt="" />
          <span className="flex-1">Products</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
        <img src={orders} className="h-10 w-10 mr-4" alt="" />
          <span className="flex-1">Orders</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
        <img src={revenue} className="h-10 w-10 mr-4" alt="" />
          <span className="flex-1">Revenue</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button onClick={()=>setCurrentView("qanda")}  className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
        <img src={messages} className="h-10 w-10 mr-4" alt="" />
          <span className="flex-1">Q & A</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button onClick={()=>setCurrentView("complaints")}  className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
        <img src={Complaints} className="h-10 w-10 mr-4" alt="" />
          <span className="flex-1">Complaints</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button onClick={()=>setCurrentView("ratings")} className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
        <img src={reviews} className="h-10 w-10 mr-4" alt="" />
          <span className="flex-1">Reviews</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
        <img src={refund} className="h-10 w-10 mr-4" alt="" />
          <span className="flex-1">Refund & Returns</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button onClick={()=>setCurrentView("feedback")} className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
        <img src={promotions} className="h-10 w-10 mr-4" alt="" />
          <span className="flex-1">FeedBack</span>
          <span className="text-gray-400">&gt;</span>
        </button>
        <button className="flex items-center px-4 py-3 w-full text-xl font-semibold border-b border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition duration-200">
        <img src={offers} className="h-10 w-10 mr-4" alt="" />
          <span className="flex-1">Discounts & Offers</span>
          <span className="text-gray-400">&gt;</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
