import React, { useState } from "react";

const FreeshippingSection = () => {
  const [freeShippingOffers, setFreeShippingOffers] = useState([]);
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleAddFreeShipping = () => {
    if (minOrderAmount) {
      const newOffer = {
        id: freeShippingOffers.length + 1, // Temporary ID generation
        minOrderAmount: parseFloat(minOrderAmount).toFixed(2),
        description,
        startDate: new Date().toLocaleDateString(),
        endDate: new Date(
          new Date().setDate(new Date().getDate() + 30)
        ).toLocaleDateString(), // Default to 30 days from now
        isActive: true,
      };
      setFreeShippingOffers([...freeShippingOffers, newOffer]);
      setMinOrderAmount("");
      setDescription("");
    }
  };

  return (
    <div className="w-full bg-white shadow-md py-4 px-6">
      <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
        Dashboard &gt; <span className="text-indigo-600">Free Shipping</span>
      </h1>

      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-600">Add Free Shipping</h2>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <input
            type="number"
            placeholder="Min Order Amount"
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/3"
            value={minOrderAmount}
            onChange={(e) => setMinOrderAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description (Optional)"
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            onClick={handleAddFreeShipping}
          >
            Add Free Shipping
          </button>
        </div>
      </div>

      {freeShippingOffers.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-600">
            Free Shipping Offers
          </h2>
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">Min Order Amount</th>
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">Start Date</th>
                <th className="border border-gray-300 px-4 py-2">End Date</th>
                <th className="border border-gray-300 px-4 py-2">Active</th>
              </tr>
            </thead>
            <tbody>
              {freeShippingOffers.map((offer, index) => (
                <tr key={offer.id}>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    ${offer.minOrderAmount}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {offer.description || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {offer.startDate}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {offer.endDate}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {offer.isActive ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FreeshippingSection;

