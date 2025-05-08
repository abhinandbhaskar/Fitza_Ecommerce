import React, { useState } from 'react'

const FeedBackSection = () => {
    const [currentView,setCurrentView]=useState("seller");
  return (
    <div className="min-h-screen bg-gray-50">
    <div className="bg-white shadow-md py-4 px-6">
      <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
        Dashboard &gt; <span className="text-indigo-600">FeedBacks</span>
      </h1>
    </div>
    
    <div className="py-6 px-6">
        <div className="flex gap-4">
          <button onClick={()=>setCurrentView("seller")} className="px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600">
            Seller FeedBack
          </button>
          <button onClick={()=>setCurrentView("user")} className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600">
            User FeedBack About Seller
          </button>
        </div>
      </div>
{
    currentView==="seller" && (
        <div>
        <h3 className='text-blue-600'>Seller FeedBack</h3>
    <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Account Status</th>
                            <th>Registration Date</th>
                            <th>Last Login</th>
                            <th>Total Orders</th>
                        
                        </tr>
                    </thead>
                        <tbody>
                            
                          
                                <tr key="" className="hover:bg-gray-100 transition duration-200">
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    users
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    full_name
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    email
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    phone
                                </td>
              
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    date_joined
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    users.last_login
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    7
                                </td>
                              
                            </tr>
                        
                        </tbody>
      </table>
    </div>

      
    )
}

{
    currentView==="user" && (
        <div>
        <h3 className='text-red-600'>User FeedBack About Seller</h3>
    <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Account Status</th>
                            <th>Registration Date</th>
                            <th>Last Login</th>
                            <th>Total Orders</th>
                        
                        </tr>
                    </thead>
                        <tbody>
                            
                          
                                <tr key="" className="hover:bg-gray-100 transition duration-200">
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    users
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    full_name
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    email
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    phone
                                </td>
              
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    date_joined
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    users.last_login
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    7
                                </td>
                              
                            </tr>
                        
                        </tbody>
      </table>
    </div>

      
    )
}
    </div>
  )
}

export default FeedBackSection
