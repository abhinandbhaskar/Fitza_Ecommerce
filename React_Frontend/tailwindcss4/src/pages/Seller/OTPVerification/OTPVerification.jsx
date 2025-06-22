import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60); 
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const navigate=useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer); 
    } else {
      setIsOtpExpired(true);
    }
  }, [countdown]);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.trim() === "" || isNaN(otp) || parseInt(otp) < 0) {
      alert("Please enter a valid OTP.");
      return;
    }
    const otpData={
        otp:otp.trim()
    }

    try{
        const response=await axios.post("https://127.0.0.1:8000/api/seller/verify_otp/",otpData);
        console.log(response);
        console.log(response.data)
        navigate("/seller/shopdetailsregister");
    }
    catch(errors){
        console.log(errors)
    }
    
  };

  const handleResendOtp = async () => {
    try {
    
      const response = await axios.post("https://127.0.0.1:8000/api/seller/resend_otp/");
      console.log("Response:", response);
      console.log("Response Data:", response.data);
  
     
      setCountdown(60); 
      setIsOtpExpired(false);
      setOtp(""); 

      navigate("/seller/otpverification");
  
      console.log("OTP Resent Successfully");
    } catch (errors) {
      console.error("Error Resending OTP:", errors);
      if (errors.response) {
        console.error("Server Response:", errors.response.data);
      } else {
        console.error("Network/Other Error:", errors.message);
      }
    }
  };
  

  return (
    <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
          OTP Verification
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
      
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-600">
              Enter OTP:
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={handleOtpChange}
              disabled={isOtpExpired}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the OTP"
              required
            />
          </div>

          {!isOtpExpired ? (
            <p className="text-sm text-gray-500">
              Didn't receive the OTP? Wait{" "}
              <span className="font-semibold text-gray-700">
                {Math.floor(countdown / 60)}:
                {countdown % 60 < 10 ? `0${countdown % 60}` : countdown % 60}
              </span>
            </p>
          ) : (
            <p className="text-sm text-red-500">OTP has expired. Resend OTP to try again.</p>
          )}

         
          <button
            type="submit"
            disabled={isOtpExpired}
            className={`w-full px-4 py-2 text-white ${
              isOtpExpired ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all`}
          >
            Verify OTP
          </button>
        </form>

        {/* Resend OTP Button */}
        {isOtpExpired && (
          <button
            onClick={handleResendOtp}
            className="w-full mt-4 px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default OTPVerification;
