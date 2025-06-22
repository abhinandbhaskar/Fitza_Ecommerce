import React, { useEffect, useState } from "react";
import "./SignUpPage.css";
import fitza from "../../../assets/fitzaapp.png";
import { Link } from "react-router-dom";
import signupimg from "../../../assets/signup.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpPage = () => {
    const [animate, setAnimate] = useState(false);
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
        general: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value.trim(),
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            fullname: "",
            email: "",
            phone: "",
            password1: "",
            password2: "",
            general: "",
        };

        // Fullname validation
        if (!formData.fullname) {
            newErrors.fullname = "Full name is required";
            isValid = false;
        } else if (formData.fullname.length < 3) {
            newErrors.fullname = "Full name must be at least 3 characters";
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email address";
            isValid = false;
        }

        // Phone validation
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
            isValid = false;
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "Phone number must be 10-15 digits";
            isValid = false;
        }

        // Password validation
        if (!formData.password1) {
            newErrors.password1 = "Password is required";
            isValid = false;
        } else if (formData.password1.length < 8) {
            newErrors.password1 = "Password must be at least 8 characters";
            isValid = false;
        } else if (!/[A-Z]/.test(formData.password1)) {
            newErrors.password1 = "Password must contain at least one uppercase letter";
            isValid = false;
        } else if (!/[0-9]/.test(formData.password1)) {
            newErrors.password1 = "Password must contain at least one number";
            isValid = false;
        } else if (!/[^A-Za-z0-9]/.test(formData.password1)) {
            newErrors.password1 = "Password must contain at least one special character";
            isValid = false;
        }

        if (!formData.password2) {
            newErrors.password2 = "Please confirm your password";
            isValid = false;
        } else if (formData.password1 !== formData.password2) {
            newErrors.password2 = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("https://127.0.0.1:8000/api/register/", formData);
            if (response.data) {
                // alert(response.data.message);
                setFormData({
                    fullname: "",
                    email: "",
                    phone: "",
                    password1: "",
                    password2: "",
                });
                toast.success("Please check your email to verify your account and complete registration.");
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            }
        } catch (error) {
            let errorMsg = "Registration failed. Please check your details and try again.";

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
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const [img, setImg] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setAnimate(true);
        }, 500);

        setTimeout(() => {
            setImg(true);
        }, 1000);
    }, []);

    return (
        <div className="h-screen w-full flex justify-center relative items-center">
            <Link to={"/"}>
                <button className="absolute top-2 left-3 border-1 border-red-400 px-2 text-red-500 h-7 hover:font-bold hover:border-3 rounded-4xl flex items-center justify-center flex-row">
                    <span>&lt;</span>Back
                </button>
            </Link>

            <div className="h-screen w-full md:w-[600px] flex items-center justify-center flex-col gap-2 md:gap-5 rounded-4xl shadow-2xl">
                <form className="w-4/5 md:w-1/2 flex flex-col gap-3" onSubmit={handleRegister}>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold">SignUp</h1>
                    </div>

                    <div>
                        <input
                            type="text"
                            name="fullname"
                            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                            placeholder="Enter Your Fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            aria-label="Fullname"
                        />
                        {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
                    </div>

                    <div>
                        <input
                            type="text"
                            name="email"
                            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            aria-label="Email Address"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <input
                            type="text"
                            name="phone"
                            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                            placeholder="Mobile Number"
                            value={formData.phone}
                            onChange={handleChange}
                            aria-label="Mobile Number"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                        <input
                            type="password"
                            name="password1"
                            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                            placeholder="Enter Password"
                            value={formData.password1}
                            onChange={handleChange}
                            aria-label="Password"
                        />
                        {errors.password1 && <p className="text-red-500 text-sm mt-1">{errors.password1}</p>}
                    </div>

                    <div>
                        <input
                            type="password"
                            name="password2"
                            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                            placeholder="Re-Enter Password"
                            value={formData.password2}
                            onChange={handleChange}
                            aria-label="Re-Enter Password"
                        />
                        {errors.password2 && <p className="text-red-500 text-sm mt-1">{errors.password2}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-red-400 hover:bg-red-500 px-5 py-1 md:px-7 md:py-2 text-white font-bold text-xl rounded-full ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {loading ? "Submitting..." : "Sign Up"}
                    </button>

                    {errors.general && <p className="text-red-500 text-center">{errors.general}</p>}

                    <div className="text-center">
                        <p>or continue with</p>
                    </div>

                    {/* <div className="text-center flex items-center justify-center">
                        <a
                            href="https://localhost:8000/social/complete/google-oauth2/"
                            className="flex items-center justify-center w-[200px] px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <i className="fa-brands fa-google p-2"></i>
                            Continue with Google
                        </a>
                    </div> */}

                    <div className="text-center flex items-center justify-center">
                        <a
                            href='https://localhost:8000/social/complete/google-oauth2/'
                            className="flex items-center justify-center w-[200px] px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <i className="fa-brands fa-google p-2"></i>
                            Continue with Google
                        </a>
                    </div>

                    <div className="text-center">
                        <h4>
                            Already have an account?{" "}
                            <Link to={"/login"}>
                                <span className="text-blue-900 font-bold">Sign in</span>
                            </Link>
                        </h4>
                    </div>
                </form>
            </div>

            <div className="welcome-container h-screen w-1/3 flex justify-center flex-col items-center">
                <div className="flex w-[70%] flex-row py-2 items-center">
                    <img src={fitza} className="h-24 w-24" alt="" />
                    <h1 className="text-4xl font-bold p-1 text-gray-800">Welcome to Fitza!</h1>
                </div>
                <div className="flex w-[70%] flex-row py-1 items-center">
                    <p className="text-gray-600">
                        Discover the latest trends in fashion and find your perfect look. Let's get started on your style
                        journey today!{" "}
                    </p>
                </div>
                {img && (
                    <img
                        src={signupimg}
                        className={`rounded-2xl shadow-2xl mr-[320px] transform transition-transform duration-1000 ${
                            animate ? "translate-x-56" : ""
                        }`}
                        alt=""
                    />
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default SignUpPage;
