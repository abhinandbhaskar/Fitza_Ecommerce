import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector} from "react-redux";
import "./MyOrders.css";
import AddReturnRefund from "./MyOrderComponents/AddReturnRefund";
import ReturnRefundStatus from "./MyOrderComponents/returnrefundstatus";
import orderedImg from "../../../../assets/img/ordered.jpg"
import shippedImg from "../../../../assets/img/shipped.jpg"
import outfordeliveryImg from "../../../../assets/img/outfordelivery.jpg"
import deliveredImg from "../../../../assets/img/delivered.jpg"

"C:\Users\abhin\OneDrive\Desktop\Fitza_Ecommerce\React_Frontend\tailwindcss4\src\assets\img\ordered.jpg.jpg"

const MyOrders = ({setCurrentView,myorderview,setMyOrderView}) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const handleFilterClick = (filter) => setActiveFilter(filter);
  const { accessToken } = useSelector((state) => state.auth);
  const [orderinfo,setOrderInfo]=useState([]);
  const [details,setDetails]=useState("");
  const [orderId,setOrderId]=useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [address,setAddress]=useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [shipstatusImg,setShipStatusImg] = useState("");


  const filteredOrders = orderinfo
  .filter((order) => {
    if (activeFilter !== "all" && order.order_status.status !== activeFilter) {
      return false;
    }
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      const orderIdMatch = `#160${order.id}`.toLowerCase().includes(lowerSearchTerm);
      
      const productNameMatch = order.order_lines.some(line => {
        const productName = line?.product_item?.product?.product_name?.toLowerCase() || '';
        return productName.includes(lowerSearchTerm);
      });
      
      return orderIdMatch || productNameMatch;
    }
    
    return true;
  });




   const handleOrderCancellation = async() => {
    if (!cancellationReason) {
      alert("Please provide a cancellation reason.");
      return;
    }
   
    console.log("Order cancelled with reason:", cancellationReason);
    console.log("OrderId",orderId);

    const canceldata={
      "cancellationReason":cancellationReason,

    }
    

    try{
      const response = await axios.post(`https://127.0.0.1:8000/api/user_cancel_order/${orderId}/`,canceldata,{
        headers:{
          Authorization:`Bearer ${accessToken}`,
          "Content-Type":"application/json",
        }
      });
      console.log("Ressss",response);
      console.log("Ressss",response.data);
    }catch(errors)
    {
      console.log(errors);
      console.log(errors.response.data);
    }

  };


    const safeGet = (obj, path, defaultValue = "Not Available") => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
  };


  const fetchBill = async (orderId) => {
  try {
    const response = await axios.get(`https://127.0.0.1:8000/api/get_bill/${orderId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'blob', 
    });
    
    if (response.status === 200) {

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${orderId}.pdf`;  
      link.click(); 
    }
  } catch (error) {
    console.error("Error fetching bill:", error);
  }
};




  const handleDownloadInvoice=(oid)=>{
    console.log("))))",oid);
    fetchBill(oid);
  }
 

  const fetchOrders = async () => {

    try {
        const response = await fetch("https://127.0.0.1:8000/api/get_orders/", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            setOrderInfo(data);
            console.log("Glloeeeoeoeo",data);
           


        } 
    } catch (err) {
        console.log("error",err);
        console.log("error",err.response.data);
    } 
};

  useEffect(()=>{
    fetchOrders();
  },[])


  const handleViewDetails=(order)=>{
    setMyOrderView("details");
    console.log("Chumma",order);
    setOrderId(order.id);
    console.log("OPOPsssss",order.id);
    setDetails(order);
    setAddress(order.shipping_address.shipping_address)
    ShippingProgress(order.shipping_address.status);
  }


const formatDate = (dateString) => {
  if (!dateString) return "Not Available";
  
  const date = new Date(dateString);
  
  // Format as "June 5, 2025" (or your preferred format)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const calculateEstimatedDate = (orderDateString, daysToAdd = 5) => {
  if (!orderDateString) return "Not Available";
  
  const orderDate = new Date(orderDateString);
  orderDate.setDate(orderDate.getDate() + daysToAdd);
  
  return formatDate(orderDate);
};


const ShippingProgress=(status)=>{
  
  console.log("STATAUS",status);
  if(status==="pending")
  {
  setShipStatusImg(orderedImg);
  }else if(status==="shipped")
  {
    setShipStatusImg(shippedImg)
  }else if(status==="out-for-delivery")
  {
    setShipStatusImg(outfordeliveryImg)
  }
  else if(status==="delivered")
  {
    setShipStatusImg(deliveredImg)
  }

}

  return (
    <div className="h-full w-full p-6 flex flex-col bg-gray-50">
      {/* Header Section */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <i className="fa-solid fa-cart-shopping text-4xl text-blue-500"></i>
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
      </div>



{
  myorderview==="myorder" && (
    <>
     
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 mb-4 gap-4">
           
          <input
            type="text"
            placeholder="Search by Product Name or Order ID"
            className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => {
              console.log("Search term:", e.target.value); 
              setSearchTerm(e.target.value);
            }}
          />

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {["all","processing","pending", "confirmed","delivered", "cancelled"].map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`py-2 px-4 rounded-lg shadow-md font-medium ${
                activeFilter === filter
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        
        <table className="min-w-full table-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Product</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Order Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Order Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
                {filteredOrders.map((order,key) => (
                  <tr key={key} className="border-t hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <a href={`/order/${order.id}`} className="text-blue-500 hover:underline">
                        #160{order.id}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 flex items-center gap-2">
                      <img
                        src={"https://127.0.0.1:8000/"+order.order_lines[0].product_item.product.items[0].images[0].main_image}
                        alt="Product"
                        className="w-10 h-10 rounded"
                      />
                      <span>{order.order_lines[0].product_item.product.product_name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      <span className="text-green-600">{order.order_status.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">{order.order_date}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">Rs. {order.final_total}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 flex gap-2">
                      <button onClick={()=>handleViewDetails(order)} className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md">
                        View Order
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

</>

  )
}

{
  myorderview==="details" && details && (
    
    <>

    {/* Breadcrumb */}
    <div className="py-2 text-gray-600 text-sm">
<span>My Orders &gt; </span>
<span className="font-semibold text-blue-600">Order Details</span>
</div>
{/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-4 my-4">
            <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
            <div className="mt-2 text-gray-600">
              <p><span className="font-semibold">Order ID:</span> {details.id}</p>
            <p><span className="font-semibold">Order Date:</span> {formatDate(safeGet(details, 'order_date'))}</p>
              <p><span className="font-semibold">Order Status:</span> {safeGet(details, 'order_status.status')}</p>
              <p><span className="font-semibold">Payment Status:</span> {safeGet(details, 'payment_method.status')}</p>
              <p><span className="font-semibold">Total Amount Paid:</span> {safeGet(details, 'final_total')}</p>
            </div>
          </div>

{/* Product Details */}
<div className="bg-white rounded-lg shadow-md p-4 my-4 ">
<h2 className="text-xl font-semibold text-gray-800">Products Details</h2>

{
  details.order_lines.map((product,key)=>(
<div
  className="flex items-center justify-between p-2 mt-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white md:flex-row flex-col gap-4 px-4"
  onClick={() => {setCurrentView({ view: "productdetail", data: product });}}
>
  {/* Product Image */}
  <img
    src={"https://127.0.0.1:8000/" + product.product_item.product.items[0].images[0].main_image || "Not Available.."}
    alt="Product"
    className="w-16 h-16 object-cover rounded-lg"
  />

  {/* Product Info */}
  <div className="flex-1 text-sm md:text-base">
    <h3 className="font-semibold truncate">{product.product_item.product.product_name || "Not Available.."}</h3>
    <p className="text-gray-600 truncate">{product.product_item.product.product_description || "Not Available.."}</p>
  
    <p>
      <span className="font-semibold">Quantity:</span> {product.quantity || "Not Available.."}
    </p>
    <p>
      <span className="font-semibold">Price:</span> ${product.price || "Not Available.."}
    </p>
  </div>

  {/* Action Icon */}
  <div className="text-gray-500 hover:text-gray-700 text-xl md:text-2xl transition-colors">
   <span className="px-8 font-bold text-2xl"> &gt; </span>
  </div>
</div>

  ))
}


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




<div className="bg-white rounded-lg shadow-md p-4 my-4">
<h2 className="text-xl font-semibold text-gray-800">Shipping Status </h2>
{/* <img src={orderedImg} className="h-[200px] w-[300px]" alt="" /> */}

<div className="flex justify-center">
  <img src={shipstatusImg} className="h-[400px] w-[800px]" alt="" />
</div>



</div>




{/* Shipping Address */}
<div className="bg-white rounded-lg shadow-md p-4 my-4">
<h2 className="text-xl font-semibold text-gray-800">Shipping & Delivery Information</h2>
<h3 className="text-md font-bold text-gray-700">{address.user.first_name+address.user.last_name}</h3>
<p className="mt-2 text-gray-600">{address.address_line1},{address.address_line2},pin {address.postal_code},{address.city},{address.state},{address.country}</p>

<p>
    <span className="font-semibold">Estimated Delivery Date:</span>{" "}
    {address.estimated_delivery_date 
      ? formatDate(address.estimated_delivery_date) 
      : calculateEstimatedDate(details.order_date)}
  </p>

<p>Delivery Updates : {details.shipping_address.status}</p>
</div>

{/* Return and Refund */}
<div className="bg-white rounded-lg shadow-md p-4 my-4">
<h2 className="text-xl font-semibold text-gray-800">Return & Refund</h2>
<button onClick={()=>setMyOrderView("returnrefund")} className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
  Initiate Return
</button>
<button onClick={()=>setMyOrderView("returnrefundstatus")} className="mt-2 ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-red-700">
  Return Refund Status
</button>
</div>

{/* Price Details */}
<div className="bg-white rounded-lg shadow-md p-4 my-4">
<h2 className="text-xl font-semibold text-gray-800">Payment Details</h2>
<div className="mt-2 text-gray-600">
  <p>
    <span className="font-semibold">Payment Method Used:</span> {details.payment_method.payment_method}
  </p>

  <p>        
    <span className="font-semibold">Transaction ID :</span> {safeGet(details,'payment_method.transaction_id')}
  </p>
  <p className="font-semibold mt-2">
    <span className="text-gray-800">SubTotal:</span> {safeGet(details,'order_total')}
  </p>
    <p className="font-semibold mt-2">
    <span className="text-gray-800">Discount:</span> - {safeGet(details,'discount_amount')}
  </p>
    <p className="font-semibold mt-2">
    <span className="text-gray-800"> Shipping Fee:</span> {details.shipping_address.shipping_cost==0?"Free":details.shipping_address.shipping_cost}
  </p>
    <p className="font-semibold mt-2">
    <span className="text-gray-800">Platform fee:</span> {details.payment_method.platform_fee}
  </p>
  <p className="font-semibold mt-2">
<span className="text-gray-800">Coupon:</span> {details.applied_coupon.discount_type === "fixed" ? `-${details.applied_coupon.discount_value}` : `${details.applied_coupon.discount_value}%`}
  </p>
    <p className="font-semibold mt-2">
    <span className="text-gray-800">Total:</span> <span  className="text-green-600 font-bold text-md">{safeGet(details,'payment_method.amount')}</span>
  </p>
</div>
</div>

<div className="bg-white rounded-lg shadow-md p-4 my-4">
  <h2 className="text-xl font-semibold text-gray-800">Order Cancellation</h2>
  <textarea 
    placeholder="Enter your cancellation reason here..." 
    className="mt-2 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
    rows="3"
    onChange={(e) => setCancellationReason(e.target.value)} // Assume `setCancellationReason` is the state handler
  ></textarea>
  <button 
    onClick={() => handleOrderCancellation()} // Replace with your cancellation logic
    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
  >
    Cancel Order
  </button>
</div>


{/* Download Invoice */}
<div className="text-right mt-4">
 <button
    onClick={() => handleDownloadInvoice(details.id)} // Pass the order ID
    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
  >
    Download Invoice
  </button>
</div>


</>

  )
}

{
  myorderview==="returnrefund" && (
    <AddReturnRefund orderId={orderId}/>
  )
}


{
  myorderview==="returnrefundstatus" && (
    <ReturnRefundStatus orderId={orderId}/>
  )
}



    </div>
  );
};

export default MyOrders;
