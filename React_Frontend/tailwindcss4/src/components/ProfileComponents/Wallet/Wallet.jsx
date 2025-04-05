import React from "react";
import "./Wallet.css";
const Wallet = () => {
    return (
        <div className="h-full w-[100%]  p-10 flex flex-col">
            <div className="h-[100px] w-[100%] m-2 flex flex-row justify-start items-center">
                <div className="j">
                    <i class="fa-solid  fa-wallet text-4xl p-6"></i>
                </div>
                <h1 className="text-4xl font-bold">My Wallet</h1>
            </div>
            <div className="h-[100%] w-[100%]  m-2 flex flex-col  items-center">
                <div className="h-full w-[100%] font-bold text-md   m-1 flex flex-col ">
                    <div className="h-full w-[100%] border-1 border-gray-200 shadow-2xl rounded-4xl flex flex-row justify-center p-4">
                        <div className="h-full w-[100%]  items-center justify-center p-20 ">
                            <div>
                                <h1 className="font-bold text-4xl">Wallet Balance</h1>
                            </div>
                            <div>
                                <h3 className="font-medium text-2xl">Rs:12956.00</h3>
                            </div>
                        </div>
                        <div className="h-full w-[100%] justify-center items-center p-22">
                            <button className="bg-green-500 px-6 py-4 border-2 rounded-2xl hover:text-white hover:bg-green-600 border-gray-600 text-2xl">
                                ADD MONEY TO WALLET
                            </button>
                        </div>
                    </div>
                </div>
                <div className="h-full w-[100%] shadow-2xl rounded-3xl p-10 m-1">
                    <table class="min-w-full table-auto bg-white border-collapse shadow-lg rounded-lg overflow-hidden">
                        <thead class="bg-gray-800 text-white">
                            <tr>
                                <th class="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                                <th class="px-6 py-3 text-left text-sm font-semibold">Amount Debited</th>
                                <th class="px-6 py-3 text-left text-sm font-semibold">Date Added</th>
                                <th class="px-6 py-3 text-left text-sm font-semibold">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-t hover:bg-gray-100">
                                <td class="px-6 py-4 text-sm text-gray-800">
                                    <a href="http://">#160</a>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-800">Rs. 80,000</td>
                                <td class="px-6 py-4 text-sm text-gray-800">November 13, 2024</td>
                                <td class="px-6 py-4 text-sm text-green-600 font-semibold">Completed</td>
                            </tr>
                            <tr class="border-t hover:bg-gray-100">
                                <td class="px-6 py-4 text-sm text-gray-800">
                                    <a href="http://">#161</a>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-800">Rs. 80,000</td>
                                <td class="px-6 py-4 text-sm text-gray-800">November 13, 2024</td>
                                <td class="px-6 py-4 text-sm text-green-600 font-semibold">Completed</td>
                            </tr>
                            <tr class="border-t hover:bg-gray-100">
                                <td class="px-6 py-4 text-sm text-gray-800">
                                    <a href="http://">#162</a>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-800">Rs. 80,000</td>
                                <td class="px-6 py-4 text-sm text-gray-800">November 13, 2024</td>
                                <td class="px-6 py-4 text-sm text-green-600 font-semibold">Completed</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
