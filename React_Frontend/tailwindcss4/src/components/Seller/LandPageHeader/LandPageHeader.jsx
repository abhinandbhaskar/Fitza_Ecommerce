import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const LandPageHeader = () => {
    const navigate=useNavigate();
    const loginHandle=()=>{
        navigate("/seller/loginpage")
    }
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
    
      <div className="text-4xl px-8 font-bold text-red-400">
        Fitza
      </div>

      <div className="flex space-x-4">
        <button onClick={loginHandle} className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300">
          Login
        </button>
        <Link to="/seller/sellerregister" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700">
          Register
        </Link>
      </div>
    </header>
  );
};

export default LandPageHeader;
