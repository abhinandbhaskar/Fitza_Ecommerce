import React, { useState } from "react";
import LandPageFooter from "../../../components/Seller/LandPageFooter/LandPageFooter";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // For showing error messages
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;

const SellerRegister = () => {
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        password1: "",
        password2: "",
    });

    const [errors, setErrors] = useState({
        fullname: "",
        email: "",
        phone: "",
        password1: "",
        password2: "",
    });

    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value.trim(),
        });

        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            fullname: "",
            email: "",
            phone: "",
            password1: "",
            password2: "",
        };

        // Full Name validation
        if (!formData.fullname) {
            newErrors.fullname = "Full name is required";
            valid = false;
        } else if (formData.fullname.length < 3) {
            newErrors.fullname = "Full name must be at least 3 characters";
            valid = false;
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required";
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
            valid = false;
        }

        // Phone validation
        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
            valid = false;
        } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number (10-15 digits)";
            valid = false;
        }

        // Password validation
        if (!formData.password1) {
            newErrors.password1 = "Password is required";
            valid = false;
        } else if (formData.password1.length < 8) {
            newErrors.password1 = "Password must be at least 8 characters";
            valid = false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]/.test(formData.password1)) {
            newErrors.password1 = "Password must contain uppercase, lowercase, number, and special character (@$!%*?&_)";
            valid = false;
        }

        // Confirm Password validation
        if (!formData.password2) {
            newErrors.password2 = "Please confirm your password";
            valid = false;
        } else if (formData.password1 !== formData.password2) {
            newErrors.password2 = "Passwords do not match";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await axios.post("https://127.0.0.1:8000/api/seller/register/", formData, {
                withCredentials: true,
            });

            if (response.data) {
                toast.success("OTP has been sent to your registered email/mobile. Valid for 1 minutes.");
                setFormData({
                    fullname: "",
                    email: "",
                    phone: "",
                    password1: "",
                    password2: "",
                });
                setTimeout(() => navigate("/seller/otpverification"), 3000);
            }
        } catch (error) {
            let errorMsg = "An error occurred during registration.";

            if (error.response?.data) {
                // Handle Django's non_field_errors
                if (error.response.data.non_field_errors) {
                    errorMsg = error.response.data.non_field_errors[0];
                }
                // Handle other error formats
                else if (error.response.data.message) {
                    errorMsg =
                        typeof error.response.data.message === "string"
                            ? error.response.data.message.non_field_errors[0]
                            : JSON.stringify(error.response.data.message.non_field_errors[0]);
                }
            } else if (error.message) {
                errorMsg = error.message.non_field_errors[0];
            }

            setApiError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header className="bg-white shadow-md p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-indigo-600">Fitza</h1>
                <Link
                    to="/seller/landpage"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Back to Home
                </Link>
            </header>

            <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">Seller Registration</h2>

                    {apiError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{apiError}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-600">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullname"
                                name="fullname"
                                placeholder="Enter your full name"
                                className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.fullname ? "border-red-500" : "border-gray-300"
                                }`}
                                value={formData.fullname}
                                onChange={handleChange}
                            />
                            {errors.fullname && <p className="mt-1 text-sm text-red-600">{errors.fullname}</p>}
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
                                className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.email ? "border-red-500" : "border-gray-300"
                                }`}
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-600">
                                Mobile Number
                            </label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                placeholder="Enter your mobile number"
                                className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.phone ? "border-red-500" : "border-gray-300"
                                }`}
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password1" className="block text-sm font-medium text-gray-600">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password1"
                                name="password1"
                                placeholder="Create a password"
                                className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.password1 ? "border-red-500" : "border-gray-300"
                                }`}
                                value={formData.password1}
                                onChange={handleChange}
                            />
                            {errors.password1 && <p className="mt-1 text-sm text-red-600">{errors.password1}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="password2" className="block text-sm font-medium text-gray-600">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="password2"
                                name="password2"
                                placeholder="Confirm your password"
                                className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.password2 ? "border-red-500" : "border-gray-300"
                                }`}
                                value={formData.password2}
                                onChange={handleChange}
                            />
                            {errors.password2 && <p className="mt-1 text-sm text-red-600">{errors.password2}</p>}
                        </div>

                        {/* Register Button */}
                        <div className="mt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${
                                    loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                                }`}
                            >
                                {loading ? "Processing..." : "Register"}
                            </button>
                        </div>
                    </form>

                    {/* Login Link */}
                    <p className="text-sm text-center text-gray-500 mt-4">
                        Already have an account?{" "}
                        <Link to="/seller/login" className="text-blue-500 hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>

            <LandPageFooter />
            <ToastContainer />
        </>
    );
};

export default SellerRegister;
