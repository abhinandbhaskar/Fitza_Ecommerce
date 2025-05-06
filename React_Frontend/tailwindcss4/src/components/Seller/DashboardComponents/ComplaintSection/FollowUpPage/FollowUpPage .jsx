import React from 'react';

const FollowUpPage = ({yourcomplaint}) => {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full bg-white shadow-md py-4 px-6">
        <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
          Dashboard &gt; Complaints &gt; <span className="text-indigo-600">Follow-Up</span>
        </h1>
      </div>

      <div className="container mx-auto mt-6 px-4">
        {/* Complaint Details */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Complaint Details</h2>
          <ul className="space-y-2 text-gray-700">
            <li><strong>ID:</strong>{yourcomplaint.id}</li>
            <li><strong>Title:</strong>{yourcomplaint.title}</li>
            <li><strong>Description:</strong>{yourcomplaint.description}</li>
            <li><strong>Date Filed:</strong>{yourcomplaint.updated_at}</li>
            <li><strong>Status:</strong>{yourcomplaint.response?"replayed":"pending"}</li>
          </ul>
        </div>

        {/* Communication Thread */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Follow-Up Messages</h2>
          <div className="space-y-4">
            {/* Message example */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Admin (2025-04-28):</strong> We are reviewing your complaint.
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>You (2025-04-29):</strong> Please provide an update.
              </p>
            </div>
          </div>
          {/* Add a new message */}
          <div className="mt-4">
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
              placeholder="Type your message here..."
            ></textarea>
            <button className="mt-2 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
              Send
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
            Mark as Resolved
          </button>
          <button className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">
            Escalate Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowUpPage;
