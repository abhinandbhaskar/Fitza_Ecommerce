import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector} from "react-redux";
import AdminReturnRefund from "./AdminReturnRefund";
import { safe } from "../../../../utils/safeAccess";

const ReturnRefundSection = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const[view,setView]=useState("table");
  const[returnrefund,setReturnrefund]=useState([]);
  const[refundobj,setRefundObj]=useState("");
  const fetchAllReturnRefund=async()=>{

    try{
      const response = await axios.get('https://127.0.0.1:8000/api/admin/fetch_all_returnrefund/',{
        headers:{
          Authorization:`Bearer ${accessToken}`,
          "Content-Type":"application/json",
        }
      });
      console.log(response);
      console.log(response.data);
      setReturnrefund(response.data);
    }catch(errors)
    {
      console.log(errors);
      console.log(errors.response.data);
    }


  }

  const handleViewDetails=async(refund)=>{
    setRefundObj(refund);
    setView("form");

  }

  useEffect(()=>{
    fetchAllReturnRefund();
  },[])


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="w-full bg-white shadow-md py-4 px-6">
        <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
          Dashboard &gt; <span className="text-indigo-600">Return Refund</span>
        </h1>
      </div>


          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold">New Return Refunds</h3>
              <p className="text-2xl text-indigo-600">{returnrefund.filter(refund => refund.status === 'pending').length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold">Completed Return Refunds</h3>
              <p className="text-2xl text-green-600">{returnrefund.filter(refund => refund.status === 'completed').length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold">Rejected Return Refunds</h3>
              <p className="text-2xl text-red-600">{returnrefund.filter(refund => refund.status === 'rejected').length}</p>
            </div>
          </div>

          <div className='px-10'>
            {
              view==="form"&&(
            <button onClick={()=>setView("table")}  className="px-4 py-2  bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1">View All Return Refund </button>
              )
            }
          </div>

      

        {
          view==="table" && (

            <div className="overflow-x-auto p-6">
            <table  className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Reason</th>
                  <th>Refund Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {returnrefund.map((refund,key) => (
                  <tr key={refund.id}  className="hover:bg-gray-100 transition duration-200">
                    <td  className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">{key+1}</td>
                    <td  className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">{safe(refund,'reason')}</td>
                    <td  className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300 text-center">Rs.{safe(refund,'refund_amount')}</td>
                    <td  className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-white ${
                          refund.status === 'pending'
                            ? 'bg-yellow-500'
                            : refund.status === 'completed'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {safe(refund,'status')}
                      </span>
                    </td>
                    <td  className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300 text-center">
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

          )
        }

        {
          view==="form" && (
         <AdminReturnRefund refundobj={refundobj} />
          )
        }


    </div>
  );
};

export default ReturnRefundSection;


