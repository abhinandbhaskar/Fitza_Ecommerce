import React from "react";
import "./BillingAddress.css";
const BillingAddress = () => {
    return (
        <div className="h-full w-[100%]  p-10 flex flex-col">
            <div className="h-[100px] w-[100%] m-2 flex flex-row justify-start items-center">
                <div className="j">
                    <i class="fa-solid fa-address-card  text-4xl p-6"></i>
                </div>
                <h1 className="text-4xl font-bold">Billing Address</h1>
            </div>
            <div className="h-[100%] w-[100%]  m-2 flex flex-col  items-center">

            <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                    <label className="flex justify-start" htmlFor="">
                        Email Address :
                    </label>
                    <input
                        type="text"
                        className="block w-10/12 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                        placeholder="Email Address"
                    />
                </div>

                <div className="flex flex-row items-center justify-between w-full">
                    <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                        <label className="flex justify-start" htmlFor="">
                            First Name :
                        </label>
                        <input
                            type="text"
                            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                            placeholder=" First Name"
                        />
                    </div>
                    <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                        <label className="flex justify-start" htmlFor="">
                            Last Name :
                        </label>
                        <input
                            type="text"
                            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                            placeholder="Last Name"
                        />
                    </div>
                </div>

                
                <div className="flex flex-row items-center justify-between w-full">
                    <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                        <label className="flex justify-start" htmlFor="">
                            Address Line 1 :
                        </label>
                        <input
                            type="text"
                            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                            placeholder="Address Line1"
                        />
                    </div>
                    <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                        <label className="flex justify-start" htmlFor="">
                            Address Line 2 :
                        </label>
                        <input
                            type="text"
                            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                            placeholder="Address Line2"
                        />
                    </div>
                </div>

                
                <div className="flex flex-row items-center justify-between w-full">
                    <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                        <label className="flex justify-start" htmlFor="">
                            Country :
                        </label>
                        <input
                            type="text"
                            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                            placeholder="Country"
                        />
                    </div>
                    <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                        <label className="flex justify-start" htmlFor="">
                            Zip Code :
                        </label>
                        <input
                            type="text"
                            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                            placeholder="Zip Code"
                        />
                    </div>
                </div>

                
                <div className="flex flex-row items-center justify-between w-full">
                    <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                        <label className="flex justify-start" htmlFor="">
                            City :
                        </label>
                        <input
                            type="text"
                            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                            placeholder="City"
                        />
                    </div>
                    <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                        <label className="flex justify-start" htmlFor="">
                            State :
                        </label>
                        <input
                            type="text"
                            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                            placeholder="State"
                        />
                    </div>
                </div>

                
                <div className="flex flex-row items-center justify-between w-full">
                    <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                        <label className="flex justify-start" htmlFor="">
                           Mobile Phone :
                        </label>
                        <input
                            type="text"
                            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                            placeholder="Mobile Number"
                        />
                    </div>
                    <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                   
                    </div>
                </div>



                <div className="h-full w-[100%] m-1">
                    <button className="bg-blue-500 px-4 py-2 rounded-lg text-white text-md hover:bg-blue-700 ml-6">
                        Add Address
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillingAddress;
