import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector} from "react-redux";
import AdminReturnRefund from "./AdminReturnRefund";
// Mock Data (In real-world scenario, data would be fetched from an API)
// const returnRefunds = [
//   { id: 1, orderId: '12345', reason: 'Damaged product', refundAmount: 100, status: 'pending' },
//   { id: 2, orderId: '12346', reason: 'Wrong size', refundAmount: 50, status: 'completed' },
//   { id: 3, orderId: '12347', reason: 'Late delivery', refundAmount: 150, status: 'rejected' },
// ];

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
            <button onClick={()=>setView("table")} className='px-2 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white'>View Return Refund </button>
          </div>

      

        {
          view==="table" && (

            <div className="overflow-x-auto p-6">
            <table className="min-w-full bg-white shadow-md">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Order ID</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Reason</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Refund Amount</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {returnrefund.map((refund) => (
                  <tr key={refund.id} className="border-b">
                    <td className="py-3 px-6 text-sm">{refund.id}</td>
                    <td className="py-3 px-6 text-sm">{refund.reason}</td>
                    <td className="py-3 px-6 text-sm">${refund.refund_amount}</td>
                    <td className="py-3 px-6 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-white ${
                          refund.status === 'pending'
                            ? 'bg-yellow-500'
                            : refund.status === 'completed'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {refund.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm">
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


