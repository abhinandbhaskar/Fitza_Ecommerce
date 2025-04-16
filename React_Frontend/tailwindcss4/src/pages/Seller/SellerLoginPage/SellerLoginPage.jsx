import React, { useState } from "react";
import { Link } from "react-router-dom";
import {useSelector,useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { loginSuccess } from '../../../redux/authSlice';
import { updateProfile } from '../../../redux/profileSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 


const SellerLoginPage = () => {
  const[username,setUsername]=useState("");
  const [password, setPassword] = useState("");
  const[error,setError]=useState("");
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

  const loginData={
    username:username.trim(),
    password:password.trim()
  }
  console.log("Login data:",loginData);
 try{
  const response=await axios.post("https://127.0.0.1:8000/api/seller/seller_login/",loginData,
    {
      headers:{ "Content-Type":"application/json" },
      withCredentials: true,
    }
  );
  console.log(response);
  console.log(response.data);
          dispatch(
              loginSuccess({
                  userId:response.data.user_id,
                  accessToken:response.data.access,
                  isAuthenticated:true,
              })
          );
        dispatch(
            updateProfile({
                name:response.data.username,
                email:response.data.email,
                profilePicture: response.data.photo || null,
            })
        );
        toast.success("Login successful!");
        setTimeout(()=>{
            navigate("/seller/sellerdashboard");
        },3000);
        }
        catch(errors)
        {
            console.log("Error:",errors);
            setError(errors);
            toast.error(errors.response?.data?.message || "Login failed! Please check your username or password.");
        }
        finally{
            console.log("Completed...")
        }


  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Fitza</h1>
        <Link to="/seller/landpage" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Back to Home
        </Link>
      </header>

      {/* Login Form Section */}
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
            Seller Login
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>
              Don't have an account?{" "}
              <a href="/seller/sellerregister" className="text-indigo-600 hover:underline">
                Register here
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>© 2025 Fitza. All rights reserved.</p>
      </footer>
       <ToastContainer />
    </div>
  );
};

export default SellerLoginPage;
