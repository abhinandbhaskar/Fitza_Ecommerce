import React from 'react'

const ReturnRefundSection = () => {
  return (
    <div className="min-h-screen bg-gray-100">
    {/* Header */}
    <div className="w-full bg-white shadow-md py-4 px-6">
        <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
            Dashboard&gt; <span className="text-indigo-600">Return Refund</span>
        </h1>
    </div>
    <div className="py-6 px-6">
        <div className="flex gap-4">
          <button  className="px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600">
            User Feedbacks
          </button>
          <button  className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600">
            Send Feedback to Admin
          </button>
        </div>
      </div>
            <div className="p-6">
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th>FeedBack ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>rating</th>
                        <th>Feedback</th>
                        <th>Date</th>
                    </tr>
                </thead>
                    <tbody>
                        
                                <tr className="hover:bg-gray-100 transition duration-200">
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    #11 feedback.id
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    feedback.user.first_name
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                feedback.user.email
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                feedback.rating
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-semibold border-b border-gray-300">
                                feedback.comment
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-semibold border-b border-gray-300">
                                feedback.created_at
                                </td>
                              
            
                            </tr>
    
                        
                    </tbody>
                </table>
            </div>
        </div>

</div>
  )
}

export default ReturnRefundSection
