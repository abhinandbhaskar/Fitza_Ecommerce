import React from 'react';

const OrderDetails = () => {
  return (
    <div className="h-full w-full p-6 flex flex-col bg-gray-50">
      {/* Header Section */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <i className="fa-solid fa-cart-shopping text-4xl text-blue-500"></i>
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
      </div>

      {/* Breadcrumb */}
      <div className="py-2 text-gray-600 text-sm">
        <span>My Orders &gt; </span>
        <span className="font-semibold text-blue-600">Order Details</span>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-4 my-4">
        <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
        <div className="mt-2 text-gray-600">
          <p>
            <span className="font-semibold">Order ID:</span> 127273382
          </p>
          <p>
            <span className="font-semibold">Payment Method:</span> Cash on Delivery
          </p>
          <p>
            <span className="font-semibold">Order Date:</span> 12/03/2024
          </p>
          <p>
            <span className="font-semibold">Estimated Delivery:</span> 18/03/2024
          </p>
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-white rounded-lg shadow-md p-4 my-4">
        <h2 className="text-xl font-semibold text-gray-800">Product Details</h2>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          {/* Product Image */}
          <img
            src="https://via.placeholder.com/150"
            alt="Product"
            className="w-32 h-32 object-cover rounded-lg"
          />

          {/* Product Info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Product Name</h3>
            <p className="text-gray-600">This is a sample product description.</p>
            <p>
              <span className="font-semibold">Price:</span> $50
            </p>
            <p>
              <span className="font-semibold">Size:</span> M
            </p>
            <p>
              <span className="font-semibold">Quantity:</span> 1
            </p>
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add Feedback
            </button>
          </div>
        </div>
      </div>

      {/* Order Tracking */}
      <div className="bg-white rounded-lg shadow-md p-4 my-4">
        <h2 className="text-xl font-semibold text-gray-800">Order Tracking</h2>
        <table className="w-full mt-4 text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Order Date</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">127273382</td>
              <td className="p-2 border">12/03/2024</td>
              <td className="p-2 border text-yellow-600 font-semibold">Pending</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-lg shadow-md p-4 my-4">
        <h2 className="text-xl font-semibold text-gray-800">Shipping Address</h2>
        <p className="mt-2 text-gray-600">ABC Building, 123 Street, City, Country</p>
      </div>

      {/* Return and Refund */}
      <div className="bg-white rounded-lg shadow-md p-4 my-4">
        <h2 className="text-xl font-semibold text-gray-800">Return & Refund</h2>
        <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Initiate Return
        </button>
      </div>

      {/* Price Details */}
      <div className="bg-white rounded-lg shadow-md p-4 my-4">
        <h2 className="text-xl font-semibold text-gray-800">Price Details</h2>
        <div className="mt-2 text-gray-600">
          <p>
            <span className="font-semibold">Item Total:</span> $50
          </p>
          <p>
            <span className="font-semibold">Shipping Charges:</span> $5
          </p>
          <p className="font-semibold mt-2">
            <span className="text-gray-800">Grand Total:</span> $55
          </p>
        </div>
      </div>

      {/* Download Invoice */}
      <div className="text-right mt-4">
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
