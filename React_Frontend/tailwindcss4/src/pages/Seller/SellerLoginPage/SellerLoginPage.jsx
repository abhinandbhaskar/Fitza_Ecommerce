import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { loginSuccess } from '../../../redux/authSlice';
import { updateProfile } from '../../../redux/profileSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SellerLoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    form: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      username: "",
      password: "",
      form: ""
    };

    // Email validation
    if (!formData.username.trim()) {
      newErrors.username = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.username)) {
      newErrors.username = "Please enter a valid email address";
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, form: "" }));

    const loginData = {
      username: formData.username.trim(),
      password: formData.password.trim()
    };

    try {
      const response = await axios.post(
        "https://127.0.0.1:8000/api/seller/seller_login/",
        loginData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      dispatch(
        loginSuccess({
          userId: response.data.user_id,
          accessToken: response.data.access,
          isAuthenticated: true,
        })
      );

      dispatch(
        updateProfile({
          name: response.data.username,
          email: response.data.email,
          profilePicture: response.data.photo || null,
        })
      );

      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/seller/sellerdashboard");
      }, 2000);
    } catch (error) {
      console.log("Error:", error);
      let errorMessage = "Login failed! Please check your credentials.";
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      setErrors(prev => ({ ...prev, form: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
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
          
          {errors.form && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {errors.form}
            </div>
          )}
          
          <form onSubmit={handleLogin} noValidate>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.username ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-600"
                }`}
                placeholder="Enter your email"
                required
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-600"
                }`}
                placeholder="Enter your password"
                required
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>
              Don't have an account?{" "}
              <Link to="/seller/sellerregister" className="text-indigo-600 hover:underline">
                Register here
              </Link>
            </p>
            <p className="mt-2">
           
               Forgot your password? <a href="https://127.0.0.1:8000/password-reset/" className="text-indigo-600 hover:underline">Forgot password?</a>.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>© 2025 Fitza. All rights reserved.</p>
      </footer>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default SellerLoginPage;