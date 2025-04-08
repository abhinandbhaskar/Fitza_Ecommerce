import React, { useState } from "react";
import "./Wallet.css";
import axios from "axios"
import { useSelector } from "react-redux";
const Wallet = () => {
    const [moneyform, setMoneyForm] = useState(false);
    const[money,setMoney]=useState("");
    const {accessToken}=useSelector((state)=>state.auth);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const moneyData={
            money:money.trim(),
        }
        console.log(moneyData);
        setMoneyForm(false);
        console.log("Boo",accessToken);

        try{
            const response=await axios.post("http://127.0.0.1:8000/api/add-to-wallet/", 
                moneyData, 
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`
                  }
                }
              );              
        console.log("Response",response);
        }
        catch(error)
        {
            console.log("Error",error.response.data.errors);
            console.log("REs",error.response.errors)
        }
        finally{
            setMoney("");
            console.log("Ok");
        }
    }

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
                        {moneyform ? (
                            <div className="w-full h-full flex justify-center items-center bg-white shadow-xl rounded-2xl p-8">
                                <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Enter Amount (₹)</label>
                                        <input
                                            type="number"
                                            placeholder="e.g., 500"
                                            className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                                            value={money}
                                            onChange={(e)=>setMoney(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
                        
                                    >
                                        Add to Wallet
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="h-full w-[100%] justify-center items-center p-22">
                                <button className="bg-green-500 px-6 py-4 border-2 rounded-2xl hover:text-white hover:bg-green-600 border-gray-600 text-2xl"
                                onClick={()=>setMoneyForm(true)}
                                >
                                    ADD MONEY TO WALLET
                                </button>
                            </div>
                        )}
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
