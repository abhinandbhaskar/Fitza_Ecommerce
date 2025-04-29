import React, { useState } from "react";

const AddressSection = ({setCartView}) => {
    const[view,setView]=useState("ship")
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row gap-8 p-6 lg:px-[200px] lg:p-10">
      {/* Address Form Section */}
      <div className="bg-white shadow-lg rounded-lg flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Address</h1>
        <div className="mb-4 ">
          <button onClick={()=>setView("ship")} className="w-full lg:w-auto px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700">
            Add Shipping Address
          </button>
          <button onClick={()=>setView("billing")} className="ml-2 w-full lg:w-auto px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700">
            Add Billing Address
          </button>
        </div>

{view==="ship"&&(
            <form className="space-y-6">
            <h3 className="text-red-600 text-sm">Shipping Address</h3>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Contact Details
              </h2>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile No
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Mobile Number"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Address
              </h2>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address (House number, building, street area)
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="House/Building/Street"
              />
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                Road name/Area/Colony
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Road/Area/Colony"
              />
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                Pincode
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Pincode"
              />
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                City
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="City"
              />
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                State
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="State"
              />
            </div>
            <button onClick={()=>setCartView("payment")} className="w-full bg-green-600 text-white py-2 rounded-md shadow hover:bg-green-700">
              Save Address and Continue
            </button>
          </form>
)}
{ view==="billing" &&
    (
        <form className="space-y-6">
              <h3 className="text-red-600 text-sm">Billing Address : Optional</h3>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Contact Details
          </h2>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Full Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile No
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Mobile Number"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Address
          </h2>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address (House number, building, street area)
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="House/Building/Street"
          />
          <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
            Road name/Area/Colony
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Road/Area/Colony"
          />
          <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
            Pincode
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Pincode"
          />
          <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
            City
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="City"
          />
          <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
            State
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="State"
          />
        </div>
        <button onClick={()=>setCartView("payment")} className="w-full bg-green-600 text-white py-2 rounded-md shadow hover:bg-green-700">
          Save Address and Continue
        </button>
      </form>

    )
}

      </div>

      {/* Price Details Section */}
      <div className="bg-white shadow-lg h-[400px] rounded-lg p-6 w-full lg:w-1/3">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Price Details
        </h2>
        <div className="border-b pb-4 mb-4 space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Total MRP:</span>
            <span>$100</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Discount:</span>
            <span>-$20</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping Fee:</span>
            <span>$15</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Platform Fee:</span>
            <span>$10</span>
          </div>
        </div>
        <div className="flex justify-between text-gray-800 text-lg font-bold">
          <span>Order Total:</span>
          <span>$105</span>
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
