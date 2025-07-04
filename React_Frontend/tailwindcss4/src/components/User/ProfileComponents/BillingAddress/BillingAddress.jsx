import React, { useEffect, useState } from "react";
import "./BillingAddress.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { safe } from "../../../../utils/safeAccess";
const BillingAddress = () => {
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [country, setCountry] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [mobile, setMobile] = useState("");
    const{accessToken}=useSelector((state)=>state.auth);

    useEffect(()=>{

        const fetchBillingAddress=async()=>{
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

                    setFirstName(safe(data,'user.first_name')||"");
                    setLastName(safe(data,'user.last_name')||"");
                    setAddress1(safe(data,'address_line1')||"");
                    setAddress2(safe(data,'address_line2')||"");
                    setCountry(safe(data,'country')||"");
                    setZipcode(safe(data,'postal_code')||"");
                    setCity(safe(data,'city')||"");
                    setState(safe(data,'state')||"");
                    setMobile(safe(data,'phone')||"");
                }
            }
            catch(errors){
                console.log("Errors",errors);
            }
            finally{
                console.log("Yes");
            }
        }
        fetchBillingAddress();
    },[])

    const handleSubmit=async(e)=>{
        
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
            if(response){
                // alert(response.data.message);
                toast.success(response.data.message);


            }
        }
        catch(errors)
        {
            console.log("errors",errors);
            toast.error("Error Occured while update billing address.");
        }
        finally{
            console.log("completed...");
        }
    }

    return (
        <div className="h-full w-[100%]  p-10 flex flex-col">
            <form onSubmit={handleSubmit}>
                <div className="h-[100px] w-[100%] m-2 flex flex-row justify-start items-center">
                    <div className="j">
                        <i class="fa-solid fa-address-card  text-4xl p-6"></i>
                    </div>
                    <h1 className="text-4xl font-bold">Billing Address</h1>
                </div>
                <div className="h-[100%] w-[100%]  m-2 flex flex-col  items-center">

                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                            <label className="flex justify-start" htmlFor="">
                                First Name :
                            </label>
                            <input
                                type="text"
                                className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                                placeholder=" First Name"
                                value={firstname}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                            <label className="flex justify-start" htmlFor="">
                                Last Name :
                            </label>
                            <input
                                type="text"
                                className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                                placeholder="Last Name"
                                value={lastname}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                            <label className="flex justify-start" htmlFor="">
                                Address Line 1 :
                            </label>
                            <input
                                type="text"
                                className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                                placeholder="Address Line1"
                                value={address1}
                                onChange={(e) => setAddress1(e.target.value)}
                            />
                        </div>
                        <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                            <label className="flex justify-start" htmlFor="">
                                Address Line 2 :
                            </label>
                            <input
                                type="text"
                                className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                                placeholder="Address Line2"
                                value={address2}
                                onChange={(e) => setAddress2(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                            <label className="flex justify-start" htmlFor="">
                                Country :
                            </label>
                            <input
                                type="text"
                                className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                                placeholder="Country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        </div>
                        <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                            <label className="flex justify-start" htmlFor="">
                                Pincode :
                            </label>
                            <input
                                type="text"
                                className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                                placeholder="Zip Code"
                                value={zipcode}
                                onChange={(e) => setZipcode(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                            <label className="flex justify-start" htmlFor="">
                                City :
                            </label>
                            <input
                                type="text"
                                className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                        <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                            <label className="flex justify-start" htmlFor="">
                                State :
                            </label>
                            <input
                                type="text"
                                className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                                placeholder="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                            <label className="flex justify-start" htmlFor="">
                                Mobile Phone :
                            </label>
                            <input
                                type="text"
                                className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                                placeholder="Mobile Number"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                            />
                        </div>
                        <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col "></div>
                    </div>

                    <div className="h-full w-[100%] m-1">
                        <button type="submit" className="bg-blue-500 px-4 py-2 rounded-lg text-white text-md hover:bg-blue-700 ml-6">
                            Add Address
                        </button>
                    </div>
                </div>
            </form>
            <ToastContainer/> 
        </div>
    );
};

export default BillingAddress;
