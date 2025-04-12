import React, { useState } from 'react';
import { motion } from "framer-motion";
import axios from 'axios';
import {useSelector,useDispatch} from "react-redux";
import { loginSuccess } from '../../../redux/authSlice';
import { updateProfile } from '../../../redux/profileSlice';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
const LoginPage = () => {
    const[username,setUsername]=useState("");
    const[password,setPassword]=useState("");
    const[error,setError]=useState("");
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        const loginData={
            username:username.trim(),
            password:password.trim()
        }
        console.log(loginData);

        try{
            const response=await axios.post("https://127.0.0.1:8000/api/admin/login/",loginData,
        {
            headers: { "Content-Type": "application/json" },
            withCredentials: true, // Ensures cookies (refresh token) are handled

        });
        console.log("DaDa",response);
        console.log("DaDa",response.data);
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
            navigate("/admin/dashboardpage");
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

    }
    return (
        <div className="min-h-screen bg-gray-800 to-indigo-600 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-md w-full px-4"
            >
                <div className="bg-white shadow-xl rounded-2xl p-6">
                    <h2 className="text-2xl font-bold text-center mb-4 text-black">
                       <span className='text-red-500'>Fitza</span> Admin Login
                    </h2>
                    <p className="text-center text-gray-600 mb-6">
                        Welcome back! Please login to your account.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <div className="flex items-center bg-gray-100 rounded-lg p-2">
                            <span className="text-gray-400 mr-2 w-5 h-5">👤</span>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="bg-transparent flex-grow outline-none"
                                    value={username}
                                    onChange={(e)=>setUsername(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <div className="flex items-center bg-gray-100 rounded-lg p-2">
                            <span className="text-gray-400 mr-2 w-5 h-5">🔒</span>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="bg-transparent flex-grow outline-none"
                                    value={password}
                                    onChange={(e)=>setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition duration-200"
                        >
                            Login
                        </button>
                    </form>
                    <div className="text-center mt-4 text-sm text-gray-500">
                        <p>
                            Forgot your password? <a  href="https://127.0.0.1:8000/password-reset/" className="text-indigo-600 hover:underline">Reset it here</a>.
                        </p>
                    </div>
                </div>
            </motion.div>
            <ToastContainer />
        </div>
    );
};

export default LoginPage;
