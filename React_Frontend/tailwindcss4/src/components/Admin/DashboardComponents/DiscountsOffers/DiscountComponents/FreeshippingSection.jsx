import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { safe } from "../../../../../utils/safeAccess";

const FreeshippingSection = () => {
  const [freeShippingOffers, setFreeShippingOffers] = useState([]);
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [description, setDescription] = useState("");
  const [editOfferId, setEditOfferId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { accessToken } = useSelector((state) => state.auth);


  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };


  const handleAddOrUpdateFreeShipping = async(editOfferId) => {
    if (minOrderAmount) {
      if (editOfferId !== null) {
        // Update existing offer
        setFreeShippingOffers((prevOffers) =>
          prevOffers.map((offer) =>
            offer.id === editOfferId
              ? { ...offer, minOrderAmount, description }
              : offer
          )
        );

        const updatedOffer = {
          id:editOfferId,
          minOrderAmount,
          description,
          startDate: formatDate(new Date(startDate)),
          endDate: formatDate(new Date(new Date(endDate).setFullYear(new Date().getFullYear() + 1))),
        };
        console.log("DDADDA",updatedOffer);

        try{
          const response=await axios.post(`https://127.0.0.1:8000/api/admin/edit_shipping_offer/${editOfferId}/`,updatedOffer,{
              headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${accessToken}`,
              }
          });
          console.log(response);
          console.log(response.data);
          alert(response.data.message);
          fetchFetchFreeShip();
          
         
        }catch(errors)
        {
          console.log(errors);
          console.log(errors.response);
        }
  



        setEditOfferId(null);
      } else {
        const newOffer = {
          id: freeShippingOffers.length + 1,
          minOrderAmount: parseFloat(minOrderAmount).toFixed(2),
          description,
          startDate: formatDate(new Date(startDate)),
          endDate: formatDate(new Date(new Date(endDate).setFullYear(new Date().getFullYear() + 1))),
          isActive: true,
        };
        setFreeShippingOffers([...freeShippingOffers, newOffer]);
        

        console.log("ADD freeShippingOffers",freeShippingOffers);


        try {
          const response = await axios.post(
            "https://127.0.0.1:8000/api/admin/add_freeshipping_offer/",
            newOffer,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          alert(response.data.message);
          console.log(response);
          console.log(response.data);
          fetchFetchFreeShip();
         
        } catch (errors) {
          console.error(errors.response || errors);
        }




      }
      setMinOrderAmount("");
      setDescription("");
    }
  };

  const handleToggleActive = async(id,active) => {
    const newStatus = active ? "false" : "true"; 

    console.log("ACTIVESTATUSID",id);
    console.log("ACTIVESTATUS",active);

        try {
            const response = await axios.post(
                `https://127.0.0.1:8000/api/admin/shipoffer_active_deactive/${id}/${newStatus}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log(response.data);
            alert(response.data.message);
            
        } catch (error) {
            console.error(error.response || error);
        }






    setFreeShippingOffers((prevOffers) =>
      prevOffers.map((offer) =>
        offer.id === id ? { ...offer, isActive: !offer.isActive } : offer
      )
    );
  };

  const handleEdit = async(id) => {
    const offerToEdit = freeShippingOffers.find((offer) => offer.id === id);
    if (offerToEdit) {
      setMinOrderAmount(offerToEdit.minOrderAmount);
      setDescription(offerToEdit.description);
      setEditOfferId(id);
    }

      
        try {
          const response = await axios.get(
            `https://127.0.0.1:8000/api/admin/get_edit_freeshipoffer/${id}/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
      
          console.log(response.data);
      
          const updatedCard = {
            id: response.data.id,
            min_order_amount: response.data.card_name,
            description: response.data.discount_percentage,
            start_date: response.data.start_date,
            end_date: response.data.end_date,
            is_active: response.data.is_active,
          };
      
          setFreeShippingOffers((prev) =>
            prev.map((card) => (card.id === id ? updatedCard : card))
          );
        } catch (errors) {
          console.error(errors.response || errors);
        }finally{
          fetchFetchFreeShip();
        }



  };

  const handleDelete = async(id) => {

        try{
          const response=await axios.post(`https://127.0.0.1:8000/api/admin/delete_freeshipping_offer/${id}/`,{},{
              headers:{
                Authorization:`Bearer ${accessToken}`,
              }
          });
          console.log(response);
          console.log(response.data);
          alert(response.data.message);
          fetchFetchFreeShip();
        }catch(errors)
        {
          console.log(errors);
          console.log(errors.response);
        }
    


    setFreeShippingOffers((prevOffers) =>
      prevOffers.filter((offer) => offer.id !== id)
    );
  };
  const fetchFetchFreeShip = async () => {
    try {
      const response = await axios.get(
        "https://127.0.0.1:8000/api/admin/get_freeshipping_offer/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      setFreeShippingOffers(
        response.data.map((offer) => ({
          id: offer.id,
          minOrderAmount: offer.min_order_amount,
          description: offer.description,
          startDate: offer.start_date,
          endDate: offer.end_date,
          isActive: offer.is_active,
        }))
      );
    } catch (errors) {
      console.error(errors.response || errors);
      alert("Failed to fetch free shipping offers. Please try again.");
    }
  };
  
    useState(()=>{
      fetchFetchFreeShip();
  
    },[])

  return (
    <div className="w-full bg-white shadow-md py-4 px-6">
      <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
        Dashboard &gt; <span className="text-indigo-600">Free Shipping</span>
      </h1>

      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-600">
          {editOfferId ? "Edit Free Shipping" : "Add Free Shipping"}
        </h2>
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

           <input
            type="date"
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            onClick={()=>handleAddOrUpdateFreeShipping(editOfferId)}
          >
            {editOfferId ? "Update Offer" : "Add Free Shipping"}
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
                <th className="border border-gray-300 px-4 py-2">
                  Min Order Amount
                </th>
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">Start Date</th>
                <th className="border border-gray-300 px-4 py-2">End Date</th>
                <th className="border border-gray-300 px-4 py-2">Active</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {freeShippingOffers.map((offer, index) => (
                <tr key={offer.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ${safe(offer,'minOrderAmount')}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {safe(offer,'description') || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                   
                    {safe(offer, 'startDate') ? new Date(safe(offer, 'startDate')).toLocaleString() : 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    
                    {safe(offer, 'endDate') ? new Date(safe(offer, 'endDate')).toLocaleString() : 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {safe(offer,'isActive') ? "Yes" : "No"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 flex gap-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      onClick={() => handleToggleActive(offer.id,offer.isActive)}
                    >
                      {offer.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleEdit(offer.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(offer.id)}
                    >
                      Delete
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

export default FreeshippingSection;


