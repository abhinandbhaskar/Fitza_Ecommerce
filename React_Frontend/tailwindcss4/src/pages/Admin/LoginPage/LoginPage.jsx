import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from '../../../redux/authSlice';
import { updateProfile } from '../../../redux/profileSlice';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [errors, setErrors] = useState({
        username: "",
        password: ""
    });
    const [touched, setTouched] = useState({
        username: false,
        password: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Validate function
    const validate = (values) => {
        const validationErrors = {
            username: "",
            password: ""
        };

        if (!values.username.trim()) {
            validationErrors.username = "Username is required";
        } else if (values.username.trim().length < 3) {
            validationErrors.username = "Username must be at least 3 characters";
        }

        if (!values.password) {
            validationErrors.password = "Password is required";
        } else if (values.password.length < 6) {
            validationErrors.password = "Password must be at least 6 characters";
        }

        return validationErrors;
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate only if the field has been touched
        if (touched[name]) {
            setErrors(validate({
                ...formData,
                [name]: value
            }));
        }
    };

    // Handle blur event
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
        setErrors(validate(formData));
    };

    // Check if form is valid
    const isValid = () => {
        const validationErrors = validate(formData);
        setErrors(validationErrors);
        return Object.values(validationErrors).every(error => error === "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Mark all fields as touched
        setTouched({
            username: true,
            password: true
        });

        if (!isValid()) {
            setIsSubmitting(false);
            return;
        }

        const loginData = {
            username: formData.username.trim(),
            password: formData.password.trim()
        };

        try {
            const response = await axios.post("https://127.0.0.1:8000/api/admin/login/", loginData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

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
                navigate("/admin/dashboardpage");
            }, 3000);
        } catch (error) {
            console.log("Error:", error);
            toast.error(error.response?.data?.message || "Login failed! Please check your username or password.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-4">
                            <div className={`flex items-center bg-gray-100 rounded-lg p-2 ${touched.username && errors.username ? 'border border-red-500' : ''}`}>
                                <span className="text-gray-400 mr-2 w-5 h-5">👤</span>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    className="bg-transparent flex-grow outline-none"
                                    value={formData.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                />
                            </div>
                            {touched.username && errors.username && (
                                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                            )}
                        </div>
                        <div className="mb-6">
                            <div className={`flex items-center bg-gray-100 rounded-lg p-2 ${touched.password && errors.password ? 'border border-red-500' : ''}`}>
                                <span className="text-gray-400 mr-2 w-5 h-5">🔒</span>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className="bg-transparent flex-grow outline-none"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                />
                            </div>
                            {touched.password && errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition duration-200 disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <div className="text-center mt-4 text-sm text-gray-500">
                        <p>
                            Forgot your password? <a href="https://127.0.0.1:8000/password-reset/" className="text-indigo-600 hover:underline">Reset it here</a>.
                        </p>
                    </div>
                </div>
            </motion.div>
            <ToastContainer />
        </div>
    );
};

export default LoginPage;
