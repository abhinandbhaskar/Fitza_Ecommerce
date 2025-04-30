import React, { useState } from "react";

const ProductsOfferSection = () => {
  const [offers, setOffers] = useState([]);
  const [productName, setProductName] = useState(""); // Temporary product name input
  const [offerTitle, setOfferTitle] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleAddOffer = () => {
    if (
      productName &&
      offerTitle &&
      discountPercentage &&
      startDate &&
      endDate
    ) {
      const newOffer = {
        id: offers.length + 1, // Temporary ID
        productName,
        offerTitle,
        offerDescription,
        discountPercentage: parseFloat(discountPercentage).toFixed(2),
        startDate,
        endDate,
        isActive: true,
      };
      setOffers([...offers, newOffer]);
      setProductName("");
      setOfferTitle("");
      setOfferDescription("");
      setDiscountPercentage("");
      setStartDate("");
      setEndDate("");
    }
  };

  return (
    <div className="w-full bg-white shadow-md py-4 px-6">
      <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
        Dashboard &gt; <span className="text-indigo-600">Product Offers</span>
      </h1>

      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-600">Add Product Offer</h2>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <input
            type="text"
            placeholder="Product Name"
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Offer Title"
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4"
            value={offerTitle}
            onChange={(e) => setOfferTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Offer Description"
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4"
            value={offerDescription}
            onChange={(e) => setOfferDescription(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <input
            type="number"
            placeholder="Discount Percentage"
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
          />
          <input
            type="date"
            placeholder="Start Date"
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            placeholder="End Date"
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            onClick={handleAddOffer}
          >
            Add Offer
          </button>
        </div>
      </div>

      {offers.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-600">Product Offers</h2>
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">Product Name</th>
                <th className="border border-gray-300 px-4 py-2">Offer Title</th>
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">Discount (%)</th>
                <th className="border border-gray-300 px-4 py-2">Start Date</th>
                <th className="border border-gray-300 px-4 py-2">End Date</th>
                <th className="border border-gray-300 px-4 py-2">Active</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer, index) => (
                <tr key={offer.id}>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{offer.productName}</td>
                  <td className="border border-gray-300 px-4 py-2">{offer.offerTitle}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {offer.offerDescription || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {offer.discountPercentage}%
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{offer.startDate}</td>
                  <td className="border border-gray-300 px-4 py-2">{offer.endDate}</td>
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

export default ProductsOfferSection;
