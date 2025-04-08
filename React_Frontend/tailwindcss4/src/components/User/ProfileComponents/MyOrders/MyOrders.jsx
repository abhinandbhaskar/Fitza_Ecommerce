import React from 'react'
import "./MyOrders.css"
const MyOrders = () => {
  return (
    <div className="h-full w-[100%]  p-10 flex flex-col">
    <div className="h-[100px] w-[100%] m-2 flex flex-row justify-start items-center">
        <div className="j">
            <i class="fa-solid fa-cart-shopping  text-4xl p-6"></i>
        </div>
        <h1 className="text-4xl font-bold">MyOrders</h1>
    </div>
    <div className="h-[100%] w-[100%]  m-2 flex flex-col  items-center">

    <div className="h-full w-[100%] font-bold text-md bg-amber-300  m-1 flex flex-col ">
    <table class="min-w-full table-auto bg-white border-collapse shadow-lg rounded-lg overflow-hidden">
  <thead class="bg-gray-800 text-white">
    <tr>
      <th class="px-6 py-3 text-left text-sm font-semibold">Order</th>
      <th class="px-6 py-3 text-left text-sm font-semibold">Date</th>
      <th class="px-6 py-3 text-left text-sm font-semibold">Status</th>
      <th class="px-6 py-3 text-left text-sm font-semibold">Total</th>
      <th class="px-6 py-3 text-left text-sm font-semibold">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-t hover:bg-gray-100">
      <td class="px-6 py-4 text-sm text-gray-800"><a href="http://">#160</a></td>
      <td class="px-6 py-4 text-sm text-gray-800">November 13, 2024</td>
      <td class="px-6 py-4 text-sm text-green-600 font-semibold">Completed</td>
      <td class="px-6 py-4 text-sm text-gray-800">Rs. 80,000</td>
      <td class="px-6 py-4 text-sm text-gray-800">
        <button class="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400">View</button>
      </td>
    </tr>
    <tr class="border-t hover:bg-gray-100">
      <td class="px-6 py-4 text-sm text-gray-800"><a href="http://">#161</a></td>
      <td class="px-6 py-4 text-sm text-gray-800">November 13, 2024</td>
      <td class="px-6 py-4 text-sm text-green-600 font-semibold">Completed</td>
      <td class="px-6 py-4 text-sm text-gray-800">Rs. 80,000</td>
      <td class="px-6 py-4 text-sm text-gray-800">
        <button class="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400">View</button>
      </td>
    </tr>
    <tr class="border-t hover:bg-gray-100">
      <td class="px-6 py-4 text-sm text-gray-800"><a href="http://">#162</a></td>
      <td class="px-6 py-4 text-sm text-gray-800">November 13, 2024</td>
      <td class="px-6 py-4 text-sm text-green-600 font-semibold">Completed</td>
      <td class="px-6 py-4 text-sm text-gray-800">Rs. 80,000</td>
      <td class="px-6 py-4 text-sm text-gray-800">
        <button class="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400">View</button>
      </td>
    </tr>
  </tbody>
</table>

    </div>
        <div className="h-full w-[100%] m-1">

        </div>
    </div>
</div>
  )
}

export default MyOrders
