import React,{useEffect, useState} from 'react'
import { useSelector } from "react-redux";
import axios from "axios";
const CartSection = ({setCartView}) => {

  const {accessToken}=useSelector((state)=>state.auth);
  const [cartdata,setCartData]=useState([]);

  const [size,setSize]=useState("");
  const [qnty,setQnty]=useState(0);

  const fetchData=async()=>{

    try{
      const response=await axios.get("https://127.0.0.1:8000/api/get_cart_data/",{
        headers:{
          Authorization:`Bearer ${accessToken}`,
        }
      });
      console.log("Cart Data",response);
      console.log("Cart Dataaa",response.data);
      setCartData(response.data);

      const cartData=response.data;
      console.log("Cart Data Array: ", cartData);
cartData.forEach((item, index) => console.log(`Item ${index}: `, item));



    }catch(errors){
      console.log(errors);
      console.log(errors.response.data);
    }

  }

  const RemoveProduct=async(id)=>{

    try{
      const response=await axios.post(`https://127.0.0.1:8000/api/remove_cart_product/${id}/`,{},{
        headers:{
          Authorization:`Bearer ${accessToken}`,
        }
      });
      console.log(response);
      console.log(response.data);
      fetchData();
    }catch(errors)
    {
      console.log(errors);
      console.log(errors.response.data);
    }

  }



  useEffect(()=>{
    fetchData();
  },[])

  const onHandleSize=async(e,id)=>{
    setSize(e);
    console.log("BLo",e);
    console.log("ProID",id);

      console.log("CCCC",id);

      const inputData = {
          "size": size.trim(),
      };

  
      try {
          const response = await axios.post(`https://127.0.0.1:8000/api/cart_size/${id}/`, inputData, {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
              },
          });
          console.log(response);
          console.log(response.data);
  
         
      } catch (err) {
          console.error("Error:", err.response?.data || err.message);
      }




  }
  const handleQuantity=async(e,id)=>{
    setQnty(e);
    console.log("Quan",e);
    console.log("ProId",id);


      console.log("CCCC",id);

      const inputData = {
          "qnty": parseInt(qnty),
      };

  
      try {
          const response = await axios.post(`https://127.0.0.1:8000/api/cart_quantity/${id}/`, inputData, {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
              },
          });
          console.log(response);
          console.log(response.data);
  
      } catch (err) {
          console.error("Error:", err.response?.data || err.message);
      }
  

  }
  



  return (
    <div>
              {/* Cart Content */}
              <div className="container mx-auto px-[200px] py-10">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">My Cart</h3>
          <p className="text-gray-600 mb-8">You have {cartdata.length} item(s) in your cart.</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Product Details Section */}
            <div className="lg:col-span-2 space-y-6">
              {cartdata.map((item) => (
                <div
                  key={item.id}
                  className="bg-white shadow-md rounded-lg p-6 flex flex-col sm:flex-row items-center"
                >
                  <img
                    src={"https://127.0.0.1:8000/"+item.product_item.images[0].main_image}
                    alt={`${item.id} Image`}
                    className="w-24 h-24 rounded-md object-cover border"
                  />
                  <div className="flex-1 ml-6">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.product_item.product.product_name}
                    </h2>
                    <p className="text-gray-600">
                      Price: <span className="font-bold">
                        ${item.product_item.sale_price}
                        </span>
                    </p>
                    <p className="text-gray-600">Size:
                       {item.product_item.size.size_name}
                       </p>
                    <p className="text-gray-600">Quantity:
                       {item.quantity}
                       </p>
                  </div>
                  <div className="flex flex-col items-center sm:items-end">
                    <button onClick={()=>RemoveProduct(item.product_item.id)} className="text-red-600 font-semibold text-sm hover:bg-red-600 rounded-md mb-2 p-1 border-1 border-red-600 hover:text-white">
                    <i class="fa-solid fa-circle-xmark p-1"></i>
                      Remove
                    </button>
                    <div className="flex items-center space-x-4">
                      Size : <select

                        value={size}
                        onChange={(e)=>onHandleSize(e.target.value,item.product_item.product.id)}
                        
                        name="size"
                        className="border border-gray-300 rounded-md px-3 py-1"
                      >
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                      </select>
                      Quantity : <input
                        value={qnty}
                        onChange={(e)=>handleQuantity(e.target.value,item.product_item.product.id)}
                        type="number"
                        className="border border-gray-300 rounded-md w-16 px-2 py-1"
                        placeholder="Qty"
                        // defaultValue=
                        // {item.quantity}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary Section */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {/* Price Details ({
                // cartItems.length
                } items) */}
              </h2>
              <div className="border-b pb-4 mb-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Total MRP:</span>
                  {/* <span>${totalMRP}</span> */}
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount:</span>
                  {/* <span>-${discount}</span> */}
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee:</span>
                  {/* <span>${shippingFee}</span> */}
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform Fee:</span>
                  {/* <span>${platformFee}</span> */}
                </div>
              </div>
              <div className="flex justify-between text-gray-800 text-lg font-bold">
                <span>Order Total:</span>
                {/* <span>${orderTotal}</span> */}
              </div>
              <button onClick={()=>setCartView("address")} className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md shadow hover:bg-blue-700 transition">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default CartSection
