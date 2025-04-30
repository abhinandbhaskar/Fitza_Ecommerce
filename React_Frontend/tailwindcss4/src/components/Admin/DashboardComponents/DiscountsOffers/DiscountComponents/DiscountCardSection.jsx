import React, { useState } from "react";

const DiscountCardSection = () => {
  const [discountCards, setDiscountCards] = useState([]);
  const [cardName, setCardName] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");

  const handleAddDiscount = () => {
    if (cardName && discountPercentage) {
      const newDiscountCard = {
        id: discountCards.length + 1, // Temporary ID generation
        cardName,
        discountPercentage,
        startDate: new Date().toLocaleDateString(),
        endDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ).toLocaleDateString(),
        isActive: true,
      };
      setDiscountCards([...discountCards, newDiscountCard]);
      setCardName("");
      setDiscountPercentage("");
    }
  };

  return (
    <div className="w-full bg-white shadow-md py-4 px-6">
      <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
        Dashboard &gt; <span className="text-indigo-600">Discount Cards</span>
      </h1>

      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-600">Add Discount</h2>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <input
            type="text"
            placeholder="Card Name"
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/2"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Discount Percentage"
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/2"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
          />
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            onClick={handleAddDiscount}
          >
            Add Discount
          </button>
        </div>
      </div>

      {discountCards.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-600">
            Discount Cards
          </h2>
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">Card Name</th>
                <th className="border border-gray-300 px-4 py-2">
                  Discount Percentage
                </th>
                <th className="border border-gray-300 px-4 py-2">Start Date</th>
                <th className="border border-gray-300 px-4 py-2">End Date</th>
                <th className="border border-gray-300 px-4 py-2">Active</th>
              </tr>
            </thead>
            <tbody>
              {discountCards.map((card, index) => (
                <tr key={card.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {card.cardName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {card.discountPercentage}%
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {card.startDate}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {card.endDate}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {card.isActive ? "Yes" : "No"}
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

export default DiscountCardSection;

