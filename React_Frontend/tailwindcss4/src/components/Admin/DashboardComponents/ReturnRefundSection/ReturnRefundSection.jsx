import React, { useState } from 'react';

// Mock Data (In real-world scenario, data would be fetched from an API)
const returnRefunds = [
  { id: 1, orderId: '12345', reason: 'Damaged product', refundAmount: 100, status: 'pending' },
  { id: 2, orderId: '12346', reason: 'Wrong size', refundAmount: 50, status: 'completed' },
  { id: 3, orderId: '12347', reason: 'Late delivery', refundAmount: 150, status: 'rejected' },
];

const ReturnRefundSection = () => {
  const [selectedRefund, setSelectedRefund] = useState(null);

  const handleViewDetails = (refund) => {
    setSelectedRefund(refund);
  };

  const handleBackToTable = () => {
    setSelectedRefund(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="w-full bg-white shadow-md py-4 px-6">
        <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
          Dashboard &gt; <span className="text-indigo-600">Return Refund</span>
        </h1>
      </div>

      {/* Conditional Rendering of Table or Details */}
      {selectedRefund ? (
        // Detailed View
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Return Refund Details</h2>
            <p><strong>Order ID:</strong> {selectedRefund.orderId}</p>
            <p><strong>Reason:</strong> {selectedRefund.reason}</p>
            <p><strong>Refund Amount:</strong> ${selectedRefund.refundAmount}</p>
            <p><strong>Status:</strong> {selectedRefund.status}</p>
            <div className="mt-4">
              <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Approve</button>
              <button className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 ml-4">Reject</button>
            </div>
            <div className="mt-4">
              <button
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                onClick={handleBackToTable}
              >
                Back to Table
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Return Refunds Table
        <>
          {/* Card-like Representation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold">New Return Refunds</h3>
              <p className="text-2xl text-indigo-600">{returnRefunds.filter(refund => refund.status === 'pending').length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold">Completed Return Refunds</h3>
              <p className="text-2xl text-green-600">{returnRefunds.filter(refund => refund.status === 'completed').length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold">Rejected Return Refunds</h3>
              <p className="text-2xl text-red-600">{returnRefunds.filter(refund => refund.status === 'rejected').length}</p>
            </div>
          </div>

          {/* Return Refunds Table */}
          <div className="overflow-x-auto p-6">
            <table className="min-w-full bg-white shadow-md">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Order ID</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Reason</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Refund Amount</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {returnRefunds.map((refund) => (
                  <tr key={refund.id} className="border-b">
                    <td className="py-3 px-6 text-sm">{refund.orderId}</td>
                    <td className="py-3 px-6 text-sm">{refund.reason}</td>
                    <td className="py-3 px-6 text-sm">${refund.refundAmount}</td>
                    <td className="py-3 px-6 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-white ${
                          refund.status === 'pending'
                            ? 'bg-yellow-500'
                            : refund.status === 'completed'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {refund.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm">
                      <button
                        className="text-blue-600"
                        onClick={() => handleViewDetails(refund)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ReturnRefundSection;


