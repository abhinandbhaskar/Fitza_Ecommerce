import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
const AddressSection = ({setCartView}) => {
    const[view,setView]=useState("ship")

    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [country, setCountry] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [mobile, setMobile] = useState("");
    const { accessToken } = useSelector((state) => state.auth);


    const fetchBillingAddress = async () => {

      setFirstName("");
      setLastName("");
      setAddress1("");
      setAddress2("");
      setCountry("");
      setZipcode("");
      setCity("");
      setState("");
      setMobile("");

      try{
        const response=await fetch("https://127.0.0.1:8000/api/getBillingAddress/",{
            method:"GET",
            headers:{
                "Authorization":`Bearer ${accessToken}`,
            }
        })
        if(response.ok)
        {
            const data=await response.json();
            console.log("Yes Kitti",data);
            setFirstName(data.user.first_name||"");
            setLastName(data.user.last_name||"");
            setAddress1(data.address_line1||"");
            setAddress2(data.address_line2||"");
            setCountry(data.country||"");
            setZipcode(data.postal_code||"");
            setCity(data.city||"");
            setState(data.state||"");
            setMobile(data.phone||"");
        }
    }
    catch(errors){
        console.log("Errors",errors);
    }
    finally{
        console.log("Yes");
    }


  };    

  
  const fetchShippingAddress = async () => {

    setFirstName("");
    setLastName("");
    setAddress1("");
    setAddress2("");
    setCountry("");
    setZipcode("");
    setCity("");
    setState("");
    setMobile("");

    try {
        const response = await fetch("https://127.0.0.1:8000/api/getShippingAddress/", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            console.log("Yes Yess", data);
            setFirstName(data.user.first_name || "");
            setLastName(data.user.last_name || "");
            setAddress1(data.address_line1 || "");
            setAddress2(data.address_line2 || "");
            setCountry(data.country || "");
            setZipcode(data.postal_code || "");
            setCity(data.city || "");
            setState(data.state || "");
            setMobile(data.phone || "");
        }
    } catch (errors) {
        console.log("Errors", errors);
    } finally {
        console.log("Yes");
    }
};

  const handleShipping=async()=>{
    setView("ship")
    fetchShippingAddress();

  
  }

  const handleBilling=async()=>{
    setView("billing")
    fetchBillingAddress();
  }




useEffect(()=>{
  fetchShippingAddress();
},[])


const handleBillingAddress=async(e)=>{

    e.preventDefault();
    const billingAddressData={
        firstname:firstname.trim(),
        lastname:lastname.trim(),
        address1:address1.trim(),
        address2:address2.trim(),
        country:country.trim(),
        zipcode:zipcode.trim(),
        city:city.trim(),
        state:state.trim(),
        mobile:mobile.trim()
    }
    console.log(billingAddressData);

    try{
        const response=await axios.post("https://127.0.0.1:8000/api/AddBillingAddess/",billingAddressData,{
            headers:{
                "Content-Length":"application/json",
                "Authorization":`Bearer ${accessToken}`
            }
        });
            alert(response.data.message);
            setCartView("payment")
    }
    catch(errors)
    {
        console.log("errors",errors);
    }
    finally{
        console.log("completed...");
    }
}


const handleShippingAddress=async(e)=>{
          e.preventDefault();
          const shippingAddressData = {
              firstname: firstname.trim(),
              lastname: lastname.trim(),
              address1: address1.trim(),
              address2: address2.trim(),
              country: country.trim(),
              zipcode: zipcode.trim(),
              city: city.trim(),
              state: state.trim(),
              mobile: mobile.trim(),
          };
          console.log(shippingAddressData);
          try {
              const response = await axios.post("https://127.0.0.1:8000/api/AddShippingAddess/", shippingAddressData, {
                  headers: {
                      "Content-Length": "application/json",
                      Authorization: `Bearer ${accessToken}`,
                  },
              });
              
                  alert(response.data.message);
                  setCartView("payment")
             
          } catch (errors) {
              console.log("errors", errors);
          } finally {
              console.log("completed...");
          }
    


}


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row gap-8 p-6 lg:px-[200px] lg:p-10">
      {/* Address Form Section */}
      <div className="bg-white shadow-lg rounded-lg flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Address</h1>
        <div className="mb-4 ">
          <button onClick={()=>handleShipping()} className="w-full lg:w-auto px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700">
            Add Shipping Address
          </button>
          <button onClick={()=>handleBilling()} className="ml-2 w-full lg:w-auto px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700">
            Add Billing Address
          </button>
        </div>

{view==="ship"&&(
            <form onSubmit={handleShippingAddress} className="space-y-6">
            <h3 className="text-red-600 text-sm">Shipping Address</h3>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Contact Details
              </h2>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="First Name"
                value={firstname}
                onChange={(e)=>setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="LastName"
                value={lastname}
                onChange={(e)=>setLastName(e.target.value)}
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile No
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e)=>setMobile(e.target.value)}
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Address
              </h2>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address (House number, building, street area)
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="House/Building/Street"
                value={address1}
                onChange={(e)=>setAddress1(e.target.value)}
              />
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                Road name/Area/Colony
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Road/Area/Colony"
                value={address2}
                onChange={(e)=>setAddress2(e.target.value)}
              />
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                Pincode
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Pincode"
                value={zipcode}
                onChange={(e)=>setZipcode(e.target.value)}
              />
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                City
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="City"
                value={city}
                onChange={(e)=>setCity(e.target.value)}
              />
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                State
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="State"
                value={state}
                onChange={(e)=>setState(e.target.value)}
              />

              <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                Country
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="State"
                value={country}
                onChange={(e)=>setCountry(e.target.value)}
              />

            </div>
          

            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md shadow hover:bg-green-700">
              Save Address and Continue
            </button>

          </form>
)}
{ view==="billing" &&
    (
        <form onSubmit={handleBillingAddress} className="space-y-6">
              <h3 className="text-red-600 text-sm">Billing Address : Optional</h3>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Contact Details
          </h2>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="First Name"
            value={firstname}
            onChange={(e)=>setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Last Name"
            value={lastname}
            onChange={(e)=>setLastName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile No
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e)=>setMobile(e.target.value)}
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Address
          </h2>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address (House number, building, street area)
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="House/Building/Street"
            value={address1}
            onChange={(e)=>setAddress1(e.target.value)}
          />
          <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
            Road name/Area/Colony
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Road/Area/Colony"
            value={address2}
            onChange={(e)=>setAddress2(e.target.value)}
          />
          <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
            Pincode
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Pincode"
            value={zipcode}
            onChange={(e)=>setZipcode(e.target.value)}
          />
          <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
            City
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="City"
            value={city}
            onChange={(e)=>setCity(e.target.value)}
          />
          <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
            State
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="State"
            value={state}
            onChange={(e)=>setState(e.target.value)}
          />
                    <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
            Country
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Country"
            value={country}
            onChange={(e)=>setCountry(e.target.value)}
          />
        </div>
    

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md shadow hover:bg-green-700">
          Save Address and Continue
        </button>
      </form>

    )
}

      </div>

      {/* Price Details Section */}
      <div className="bg-white shadow-lg h-[400px] rounded-lg p-6 w-full lg:w-1/3">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Price Details
        </h2>
        <div className="border-b pb-4 mb-4 space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Total MRP:</span>
            <span>$100</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Discount:</span>
            <span>-$20</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping Fee:</span>
            <span>$15</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Platform Fee:</span>
            <span>$10</span>
          </div>
        </div>
        <div className="flex justify-between text-gray-800 text-lg font-bold">
          <span>Order Total:</span>
          <span>$105</span>
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
