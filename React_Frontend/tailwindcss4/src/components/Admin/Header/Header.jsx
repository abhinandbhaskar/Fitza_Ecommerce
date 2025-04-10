import React from 'react';
import "./Header.css";
import fitza from "../../../assets/fitzaapp.png";
import profile from "../../../assets/profile.jpg";

const Header = () => {
  return (
    <div className='w-full bg-gray-900 flex flex-col md:flex-row'>
   
      <div className='w-full md:w-1/4 bg-gray-800 border-b md:border-r border-gray-800 flex items-center justify-center p-2'>
        <img src={fitza} className='h-12 w-12' alt="Fitza Logo" />
        <h1 className='text-xl md:text-2xl text-white font-bold px-2'>Fitza Admin</h1>
      </div>

   
      <div className='w-full md:w-3/4 flex flex-col md:flex-row bg-white '>
      
        <div className='w-full md:w-2/5 p-2 flex items-center justify-center'>

        </div>
        <div className='w-full md:w-2/5 p-2 flex items-center justify-center'>
          <div className="flex items-center border border-gray-300 rounded-2xl shadow-sm bg-white px-3 py-2 w-full max-w-md">
            <select className="text-sm text-gray-700 bg-white outline-none border-none mr-2">
              <option>User</option>
              <option>Seller</option>
              <option>Product</option>
            </select>
            <input 
              type="text" 
              placeholder="Search..." 
              className="flex-1 text-sm px-2 py-1 outline-none bg-transparent text-gray-800"
            />
            <button className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" 
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" 
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </button>
          </div>
        </div>

       
        <div className='w-full md:w-3/5 flex flex-wrap items-center justify-center md:justify-start gap-4 px-4 py-2'>
          {["bell", "envelope", "gear", "right-from-bracket", "circle-info"].map((icon, index) => (
            <div key={index} className='h-10 w-10 rounded-full border-2 hover:bg-gray-500 border-gray-700 flex items-center justify-center'>
              <i className={`fa-solid fa-${icon}`}></i>
            </div>
          ))}
        </div>
      </div>

     
      <div className='w-full md:w-1/4 flex items-center gap-2 bg-white border-t md:border-t-0 md:border-l border-gray-600 p-4'>
        <img src={profile} className='h-12 w-12 border-2 border-gray-700 rounded-full' alt="Profile" />
        <div className='flex flex-col text-sm'>
          <h1 className='font-bold'>Kamala Haris</h1>
          <p className='text-gray-600'>kamala@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
