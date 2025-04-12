import React, { useState } from 'react';
import LandPageFooter from "../../../components/Seller/LandPageFooter/LandPageFooter"
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;
const SellerRegister = () => {
    const[fullname,setFullname]=useState("");
    const[email,setEmail]=useState("");
    const[phone,setPhone]=useState("");
    const[password1,setPassword1]=useState("");
    const[password2,setPassword2]=useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError("");
        setLoading(true); 
        const registerData={
            fullname:fullname.trim(),
            email:email.trim(),
            phone:phone.trim(),
            password1:password1.trim(),
            password2:password2.trim()
        }
        console.log(registerData);

                try{
                    const response = await axios.post("https://127.0.0.1:8000/api/seller/register/",registerData,{
                      withCredentials: true,
                    });
                    console.log("201::",response.data);
                    if(response.data)
                    {
                        alert(response.data.message);
                        setFullname("");
                        setEmail("");
                        setPhone("");
                        setPassword1("");
                        setPassword2("");
                       setTimeout(()=>{
                        navigate("/seller/otpverification");
                       },2000);
                    }
                }
                catch(error){
                    if(error.response&&error.response.data)
                    {
                        setError(error.response.data.detail||error.response.data.message||"An Error Occured during registration.")
                    }
                    else{
                        setError("An Error occured please try again.")
                    }
                }
                finally{
                    setLoading(false);
                }

    }

    

  return (
    <>
<header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Fitza</h1>
        <Link to="/seller/landpage" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Back to Home
        </Link>
      </header>
    <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">Seller Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={fullname}
              onChange={(e)=>setFullname(e.target.value)}
            />
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}           
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-600">
              Mobile Number
            </label>
            <input
              type="text"
              id="mobile"
              name="phone"
              placeholder="Enter your mobile number"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={password1}
              onChange={(e)=>setPassword1(e.target.value)}
          />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={password2}
              onChange={(e)=>setPassword2(e.target.value)}
            />
          </div>

          {/* Register Button */}
          <div className="mt-4">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              Register
            </button>
          </div>
        </form>
        {/* Additional Note */}
        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
    <LandPageFooter/>
</>
  );
};

export default SellerRegister;

