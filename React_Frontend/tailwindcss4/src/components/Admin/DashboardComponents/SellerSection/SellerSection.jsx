import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {safe} from "../../../../utils/safeAccess";
const SellerSection = ({searchTerm}) => {
    const { accessToken } = useSelector((state) => state.auth);
    const [sellers, setSellers] = useState([]);
    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState("approved");
    const[seller,setSeller]=useState(null);
    const [filteredSellers, setFilteredSellers] = useState([]);
    const [approvedSellers,setApprovedSellers]=useState(0);
    const [pendingSellers,setPendingSellers]=useState(0);


    const fetchSellers = async () => {
        try {
            const response = await fetch("https://127.0.0.1:8000/api/admin/view_sellers/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Grrook",data.data);
                setSellers(data.data);
                // setFilteredSellers(data.data);
                setApprovedSellers(data.approve);
                setPendingSellers(data.pending);
            }
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        } finally {
            console.log("Completed....");
            setLoading("approved");
            setLoading(false);
        }
    };



    const pendingApplication = async () => {
        setCurrentView("pending");
        try {
            const response = await fetch(`https://127.0.0.1:8000/api/admin/view_seller_approvals/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Seller Appovals::",data);
                setApprovals(data);
            }
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        } finally {
            console.log("Completed....");
            setLoading(false);
        }
    };


    useEffect(()=>{
    console.log("seller",searchTerm);
    if (searchTerm.trim() === "") {
            setFilteredSellers(sellers);
        } else {
            const filtered = sellers.filter(seller => {
                const sellerName = `${seller.user.first_name} ${seller.user.last_name}`.toLowerCase();
                const shopName = seller.shop_name.toLowerCase();
                const search = searchTerm.toLowerCase();
                return sellerName.includes(search) || shopName.includes(search);
            });
            setFilteredSellers(filtered);
        }
    },[searchTerm,sellers])

    useEffect(() => {
        
        if (currentView==="approved") {
            ourSellers();
            
        } else {
            pendingApplication();
        }
    }, []);




    const ourSellers = () => {
        setCurrentView("approved");
        fetchSellers();
    };





    const approveSeller = async(seller_id) => {
        try{
            const response=await axios.post(`https://127.0.0.1:8000/api/admin/approve_seller/${seller_id}/`,{},
                {
                    headers:{
                        Authorization: `Bearer ${accessToken}`,
                    }
                }
            )
            if(response.status===200)
            {
                alert("Seller Approved successfully...");
                pendingApplication();
            }
        }
        catch(errors)
        {
            console.log(errors);
            console.log(errors.data.response);
        }
    };

    const removeSeller = async (seller_id) => {
        console.log("se", seller_id);

        try {
            const response = await axios.post(
                `https://127.0.0.1:8000/api/admin/remove_seller/${seller_id}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if (response.status === 200) {
                fetchSellers();
            }
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    const handleRemove = (seller_id) => {
        if (window.confirm("Are You Sure do you wanna remove Seller"));
        {
            removeSeller(seller_id);
        }
    };

    const ViewSellerDetails=async(id)=>{
        setCurrentView("detailview");

        try{
      const response=await axios.get(`https://127.0.0.1:8000/api/admin/view_sellers_details/${id}/`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
      },
      });
      setSeller(response.data[0]);
      console.log("OO",response.data[0]);
    }
    catch(errors)
    {
      console.log(errors);
      if(errors.response)
      {
        console.log(errors.response?.data|| "Error occurred while fetching seller details.");
      }
      else{
        console.log("Error occured...");
      }
    }

    }




    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    Dashboard &gt; <span className="text-indigo-600">Seller</span>
                </h1>
            </div>
           <div className="w-full bg-white shadow-md py-4 px-6 flex gap-4 items-center">
  <button
    onClick={() => ourSellers()}
    className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg text-white font-medium shadow-md transition-all hover:bg-green-700 hover:shadow-lg focus:ring-2 focus:ring-green-400"
  >
    <span className="bg-white text-green-600 rounded-full px-3 py-1 font-bold text-sm shadow-md">
      {approvedSellers}
    </span>
    Approved Sellers
  </button>
  <button
    onClick={() => pendingApplication()}
    className="flex items-center gap-2 px-4 py-2 bg-orange-600 rounded-lg text-white font-medium shadow-md transition-all hover:bg-orange-700 hover:shadow-lg focus:ring-2 focus:ring-orange-400"
  >
    <span className="bg-white text-orange-600 rounded-full px-3 py-1 font-bold text-sm shadow-md">
      {pendingSellers}
    </span>
    Pending Applications
  </button>
</div>



            {currentView === "approved" && (
                 <div className="w-full bg-white shadow-md py-4 px-6">
                    <h1 className="p-2 text-blue-700 font-bold text-sm">Our Sellers </h1>
                </div>
            )}
        { currentView ==="pending" && ( <div className="w-full bg-white shadow-md py-4 px-6">
                    <h1 className="p-2 text-red-700 font-bold text-sm"> Pending Approvals</h1>
                </div>
            )}



            {/* Table Container */}
            <div className="p-6">
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    {loading ? (
                        <p className="text-center text-gray-600 py-4">Loading users...</p>
                    ) : (
                        <table className="min-w-full border-collapse border border-gray-200">
                           { currentView !== "detailview"  && 
                            (
                                 <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Shop Name</th>
                                    <th>Registration Date</th>
                                    <th>View Profile</th>
                                    <th>Account Status</th>
                                    {currentView==="approved"?(<></>):(<th>Approve Seller</th>)}
                                    <th>Remove Seller</th>
                                </tr>
                            </thead>
                            )
                           }
                            {currentView === "approved" && (
                                <tbody>
                                    {filteredSellers && filteredSellers.length > 0 ? (
                                        filteredSellers.map((sellers,key) => (
                                            <tr key={sellers.id} className="hover:bg-gray-100 transition duration-200">
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    {key+1}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    {safe(sellers,'user.first_name')}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    {safe(sellers,'email')}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    {safe(sellers,'shop_name')}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-green-600 font-semibold border-b border-gray-300">
                                                    {safe(sellers,'joining_date')}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                   
                                                    <button onClick={()=>ViewSellerDetails(sellers.id)}  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200" >View</button>
                                                </td>
                                                <td className={`px-6 py-4 text-sm ${sellers.user.is_active?"text-green-600":"text-red-600"} border-b border-gray-300`}>
                                                    {safe(sellers,'user.is_active')?"active":"Inactive"}
                                                </td>

                                                <td className="px-6 py-4 text-sm border-b border-gray-300">
                                                    <button
                                                        onClick={() => handleRemove(sellers.id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="9"
                                                className="text-center px-6 py-4 text-sm text-gray-600 border-b border-gray-300"
                                            >
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            )} 
                            { currentView === "pending" && (
                                <tbody>
                                    {approvals && approvals.length > 0 ? (
                                        approvals.map((sellers,key) => (
                                            <tr key={sellers.id} className="hover:bg-gray-100 transition duration-200">
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    {key+1}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    {safe(sellers,'user.first_name')}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    {safe(sellers,'email')}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    {safe(sellers,'shop_name',"Not Added")}
                                                </td>
                                                 <td className="px-6 py-4 text-sm text-green-600 font-semibold border-b border-gray-300">
                                                    {safe(sellers,'joining_date',"Not Added")}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    
                                                <button onClick={()=>ViewSellerDetails(sellers.id)}  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200" >View</button>
                                                </td>
                                                 <td className={`px-6 py-4 text-sm ${safe(sellers,'user.is_active')?"text-green-600":"text-red-600"} border-b border-gray-300`}>
                                                    {sellers.user.is_active?"active":"Inactive"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    <button
                                                        onClick={() => approveSeller(sellers.id)}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                                                    >
                                                        Approve
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-sm border-b border-gray-300">
                                                    <button
                                                        onClick={() => handleRemove(sellers.id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="9"
                                                className="text-center px-6 py-4 text-sm text-gray-600 border-b border-gray-300"
                                            >
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            )}
                        </table>
                    )}

                    {
                        currentView === "detailview" && seller && (
                            <div className="p-4 md:p-8 max-w-4xl mx-auto">
                              {/* Seller Details Section */}
                              <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                                <h2 className="text-xl font-bold mb-4">Seller Details</h2>
                                <div className="flex items-center space-x-6">
                                  <img
                                    src={"https://127.0.0.1:8000" + safe(seller,'user.userphoto')} // Replace with seller's photo URL
                                    alt="Seller"
                                    className="w-32 h-32 rounded-full object-cover"
                                  />
                                  <div>
                                    <p className="text-lg font-semibold">Full Name: {safe(seller,'user.first_name') || "Not available"}</p>
                                    <p>Email Address: {safe(seller,'user.email')||"Not available"}</p>
                                    <p>Mobile Number: {safe(seller,'user.phone_number') || "Not available"}</p>
                                  </div>
                                </div>
                              </div>
                          
                              {/* Shop Details Section */}
                              <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                                <h2 className="text-xl font-bold mb-4">Shop Details</h2>
                                <div className="space-y-2">
                                  <p><strong>Shop Name:</strong>{safe(seller,'shop_name') || "Not available"}</p>
                                  <p><strong>Shop Address:</strong> {safe(seller,'shop_address') || "Not available"}</p>
                                  <p><strong>Contact Number:</strong> {safe(seller,'contact_number') || "Not available"}</p>
                                  <p><strong>Shop Email:</strong> {safe(seller,'email') || "Not available"}</p>
                                  <p><strong>Tax ID:</strong>{safe(seller,'tax_id') || "Not available"}</p>
                                  <p><strong>Business Registration Number:</strong>{safe(seller,'business_registration_number') || "Not available"}</p>
                                  <p><strong>Description:</strong> {safe(seller,'description') || "Not available"}</p>
                                </div>
                              </div>
                          
                              {/* Bank Details Section */}
                              <div className="bg-white rounded-2xl shadow-md p-6">
                                <h2 className="text-xl font-bold mb-4">Bank Details</h2>
                          {
                            seller.bank_details?(
                              <div className="space-y-2">
                              <p><strong>Account Holder Name:</strong>{safe(seller,'bank_details.account_holder_name')}</p>
                              <p><strong>Bank Name:</strong> {safe(seller,'bank_details.bank_name')}</p>
                              <p><strong>Account Number:</strong> {safe(seller,'bank_details.account_number')}</p>
                              <p><strong>IFSC Code:</strong> {safe(seller,'bank_details.ifsc_code')}</p>
                              <p><strong>Branch Address:</strong> {safe(seller,'bank_details.branch_address')}</p>
                            </div>
                            ):
                            (
                              <p>Bank details are not available.</p>
                            )
                          }
                              </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default SellerSection;
