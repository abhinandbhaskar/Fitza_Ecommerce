import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { safe } from "../../../../../utils/safeAccess";

const DiscountCardSection = () => {
  const [discountCards, setDiscountCards] = useState([]);
  const [cardName, setCardName] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [editCardId, setEditCardId] = useState(null);
  const { accessToken } = useSelector((state) => state.auth);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleAddOrUpdateDiscount = async (editCardId) => {
    if (cardName && discountPercentage) {
      if (editCardId) {
        // Update existing card
        setDiscountCards((prev) =>
          prev.map((card) =>
            card.id === editCardId ? { ...card, cardName, discountPercentage } : card
          )
        );

        const updatedCard = {
          cardName,
          discountPercentage,
          startDate: formatDate(new Date()),
          endDate: formatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1))),
        };

        console.log("IDDDDDDDDDDDDD",editCardId);
        console.log("DDDDataaaaaaaaa",updatedCard);

              
      try{
        const response=await axios.post(`https://127.0.0.1:8000/api/admin/edit_discount_card/${editCardId}/`,updatedCard,{
            headers:{
              "Content-Type":"application/json",
              Authorization:`Bearer ${accessToken}`,
            }
        });
        console.log(response);
        console.log(response.data);
        alert(response.data.message);
        fetchDiscoundCard()
       
      }catch(errors)
      {
        console.log(errors);
        console.log(errors.response);
      }





        setEditCardId(null);
      } else {
        // Add new card
        const newDiscountCard = {
          id: discountCards.length + 1,
          cardName,
          discountPercentage,
          startDate: formatDate(new Date()),
          endDate: formatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1))),
          isActive: true,
        };

        try {
          const response = await axios.post(
            "https://127.0.0.1:8000/api/admin/add_discount_card/",
            newDiscountCard,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          alert(response.data.message);
          fetchDiscoundCard()
        } catch (errors) {
          console.error(errors.response || errors);
        }

        setDiscountCards([...discountCards, newDiscountCard]);
      }
      setCardName("");
      setDiscountPercentage("");
    }
  };

  const handleEdit = async (id) => {
    const cardToEdit = discountCards.find((card) => card.id === id);
    if (cardToEdit) {
      setCardName(cardToEdit.card_name);
      setDiscountPercentage(cardToEdit.discount_percentage);
      setEditCardId(id);
    }
  
    try {
      const response = await axios.get(
        `https://127.0.0.1:8000/api/admin/get_edit_discount_card/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      console.log(response.data);
  
      const updatedCard = {
        id: response.data.id,
        card_name: response.data.card_name,
        discount_percentage: response.data.discount_percentage,
        start_date: response.data.start_date,
        end_date: response.data.end_date,
        is_active: response.data.is_active,
      };
  
      // Update the card in the discountCards array
      setDiscountCards((prev) =>
        prev.map((card) => (card.id === id ? updatedCard : card))
      );
    } catch (errors) {
      console.error(errors.response || errors);
    }finally{
      fetchDiscoundCard();
    }
  };
  
  const handleDelete = async(id) => {
    setDiscountCards((prev) => prev.filter((card) => card.id !== id));
    console.log("Id",id);

    
    try{
      const response=await axios.post(`https://127.0.0.1:8000/api/admin/delete_discount_card/${id}/`,{},{
          headers:{
            Authorization:`Bearer ${accessToken}`,
          }
      });
      console.log(response);
      console.log(response.data);
      alert(response.data.message);
    }catch(errors)
    {
      console.log(errors);
      console.log(errors.response);
    }



  };
  const handleToggleActive = async (id, isActive) => {
    const newStatus = isActive ? "false" : "true"; // Toggle the status
    try {
        const response = await axios.post(
            `https://127.0.0.1:8000/api/admin/active_deactive/${id}/${newStatus}/`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        console.log(response.data);
        alert(response.data.message);
        fetchDiscoundCard();
    } catch (error) {
        console.error(error.response || error);
    }
};

  const fetchDiscoundCard=async()=>{

    try{
      const response=await axios.get("https://127.0.0.1:8000/api/admin/get_discount_cards/",{
          headers:{
            Authorization:`Bearer ${accessToken}`,
          }
      });
      console.log(response);
      console.log(response.data);
      setDiscountCards(response.data);
    }catch(errors)
    {
      console.log(errors);
      console.log(errors.response);
    }


  }


  useState(()=>{
    fetchDiscoundCard()

  },[])

  return (
    <div className="w-full bg-white shadow-md py-4 px-6">
      <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
        Dashboard &gt; <span className="text-indigo-600">Discount Cards</span>
      </h1>

      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-600">
          {editCardId ? "Edit Discount" : "Add Discount"}
        </h2>
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
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300"
            onClick={()=>handleAddOrUpdateDiscount(editCardId)}
          >
            {editCardId ? "Update Discount" : "Add Discount"}
          </button>
        </div>
      </div>

      {discountCards.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-600">Discount Cards</h2>
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">Card Name</th>
                <th className="border border-gray-300 px-4 py-2">Discount Percentage</th>
                <th className="border border-gray-300 px-4 py-2">Start Date</th>
                <th className="border border-gray-300 px-4 py-2">End Date</th>
                <th className="border border-gray-300 px-4 py-2">Active</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discountCards.map((card, index) => (
                <tr key={card.id}>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{safe(card,'card_name')}</td>
                  <td className="border border-gray-300 px-4 py-2">{safe(card,'discount_percentage')}%</td>
                  <td className="border border-gray-300 px-4 py-2">{safe(card,'start_date') ? new Date(safe(card, 'start_date')).toLocaleString() : 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{safe(card,'end_date') ? new Date(safe(card, 'end_date')).toLocaleString() : 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {safe(card,'is_active') ? "Yes" : "No"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 space-x-2">
                    <button
                      className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 rounded-md px-3 py-1 text-sm font-medium transition-all duration-200"
                      onClick={() => handleEdit(card.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 rounded-md px-3 py-1 text-sm font-medium transition-all duration-200"
                      onClick={() => handleDelete(card.id)}
                    >
                      Delete
                    </button>
                    <button
                      className={`text-white px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                        card.isActive
                          ? "bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:ring-gray-300"
                          : "bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300"
                      }`}
                      onClick={() => handleToggleActive(card.id,card.is_active)}
                    >
                      {card.isActive ? "Deactivate" : "Activate"}
                    </button>
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
