import React, { useState } from 'react';

const AddReturnRefund = () => {
  const [reason, setReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundMethod, setRefundMethod] = useState('');
  const [isPartialRefund, setIsPartialRefund] = useState(false);
  const [comments, setComments] = useState('');
  const [supportingFiles, setSupportingFiles] = useState(null);

  const handleFileChange = (e) => {
    setSupportingFiles(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your submit logic here, such as API call to create the refund request
    console.log({
      reason,
      refundAmount,
      refundMethod,
      isPartialRefund,
      comments,
      supportingFiles,
    });
  };

  return (
    <div className="h-full w-full p-6 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <i className="fa-solid fa-cart-shopping text-4xl text-blue-500"></i>
        <h1 className="text-3xl font-bold text-gray-800">Product Return Refund</h1>
      </div>

      {/* Breadcrumb */}
      <div className="py-2 text-gray-600 text-sm">
        <span>My Orders &gt; </span>
        <span className="font-semibold text-blue-600">Order Details &gt; </span>
        <span className="font-semibold text-blue-600">Return Refund</span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Reason */}
        <div className="flex flex-col">
          <label htmlFor="reason" className="text-gray-700">Reason for Return</label>
          <textarea
            id="reason"
            name="reason"
            rows="4"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="p-2 mt-2 border rounded-md"
            required
          />
        </div>

        {/* Refund Amount */}
        <div className="flex flex-col">
          <label htmlFor="refundAmount" className="text-gray-700">Refund Amount</label>
          <input
            type="number"
            id="refundAmount"
            name="refundAmount"
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
            className="p-2 mt-2 border rounded-md"
            required
          />
        </div>

        {/* Refund Method */}
        <div className="flex flex-col">
          <label htmlFor="refundMethod" className="text-gray-700">Refund Method</label>
          <select
            id="refundMethod"
            name="refundMethod"
            value={refundMethod}
            onChange={(e) => setRefundMethod(e.target.value)}
            className="p-2 mt-2 border rounded-md"
            required
          >
            <option value="">Select a method</option>
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cash_on_delivery">Cash on Delivery</option>
          </select>
        </div>

        {/* Partial Refund */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPartialRefund"
            checked={isPartialRefund}
            onChange={(e) => setIsPartialRefund(e.target.checked)}
          />
          <label htmlFor="isPartialRefund" className="text-gray-700">Partial Refund</label>
        </div>

        {/* Comments */}
        <div className="flex flex-col">
          <label htmlFor="comments" className="text-gray-700">Additional Comments</label>
          <textarea
            id="comments"
            name="comments"
            rows="4"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="p-2 mt-2 border rounded-md"
          />
        </div>

        {/* Supporting Files */}
        <div className="flex flex-col">
          <label htmlFor="supportingFiles" className="text-gray-700">Supporting Files (optional)</label>
          <input
            type="file"
            id="supportingFiles"
            name="supportingFiles"
            onChange={handleFileChange}
            className="p-2 mt-2 border rounded-md"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReturnRefund;

