import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import fitza from "../../../assets/fitzaapp.png";
import signupimg from "../../../assets/signup.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../../redux/authSlice";
import { updateProfile } from "../../../redux/profileSlice";

const LoginPage = () => {
    const [animate, setAnimate] = useState(false);
    const [img, setImg] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({
        email: "",
        password: "",
    });
    const [touched, setTouched] = useState({
        email: false,
        password: false,
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        setAnimate(true);
        setTimeout(() => {
            setImg(true);
        }, 500);
    }, []);

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (!email.trim()) {
            errors.email = "Email or username is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/^[a-zA-Z0-9_]+$/.test(email)) {
            errors.email = "Please enter a valid email or username";
            isValid = false;
        }

        if (!password) {
            errors.password = "Password is required";
            isValid = false;
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleBlur = (field) => {
        setTouched({
            ...touched,
            [field]: true,
        });
        validateForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const loginData = {
            username: email.trim(),
            password: password.trim(),
        };

        try {
            const response = await axios.post("https://127.0.0.1:8000/api/login/", loginData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            
            const imageLink = "https://127.0.0.1:8000/media/" + response.data.photo;
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
                    profilePicture: imageLink,
                })
            );
            navigate("/");
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.detail || "Login failed. Please check your credentials and try again.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full  flex justify-center relative items-center ">
            <Link to="/">
                <button className="absolute top-2 left-3 border-1 border-red-400 px-2 text-red-500 h-7 hover:font-bold hover:border-3 rounded-4xl flex items-center justify-center ">
                    <span>&lt;</span>Back
                </button>
            </Link>

            <div className="h-screen w-full md:w-[600px] flex items-center justify-center flex-col gap-2 md:gap-5 rounded-4xl shadow-2xl">
                <h1 className="text-4xl font-bold">Sign In</h1>
                {error && <p className="text-red-500">{error}</p>}

                <form onSubmit={handleSubmit} className="w-4/5 md:w-1/2 flex flex-col gap-3">
                    <div>
                        <input
                            type="text"
                            className={`block w-full px-4 py-2 text-gray-700 bg-white border ${formErrors.email && touched.email ? 'border-red-500' : 'border-gray-300'} rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none`}
                            placeholder="Username or Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => handleBlur('email')}
                            required
                        />
                        {formErrors.email && touched.email && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                        )}
                    </div>
                    <div>
                        <input
                            type="password"
                            className={`block w-full px-4 py-2 text-gray-700 bg-white border ${formErrors.password && touched.password ? 'border-red-500' : 'border-gray-300'} rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none`}
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => handleBlur('password')}
                            required
                        />
                        {formErrors.password && touched.password && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-red-400 hover:bg-red-500 px-5 py-2 text-white font-bold text-xl rounded-full"
                        disabled={loading}
                    >
                        {loading ? "Logging In..." : "Login"}
                    </button>
                </form>

                <a className="text-blue-800 font-bold" href="https://127.0.0.1:8000/password-reset/">
                    Forgot Password?
                </a>

                <h4>
                    Don't have an account?
                    <Link to="/signup">
                        <span className="text-blue-900 font-bold"> Sign up</span>
                    </Link>
                </h4>
            </div>

            <div className="welcome-container h-screen w-[600px]  flex justify-center flex-col items-center">
                <div className="flex w-[80%] flex-row py-2 items-center ">
                    <img src={fitza} className="h-24 w-24" alt="Fitza Logo" />
                    <h1 className="text-4xl font-bold p-1 text-gray-800">Welcome Back!</h1>
                </div>
                <div className="flex w-[80%]">
                      <img
                    src={img ? signupimg : ""}
                    className={`rounded-2xl shadow-2xl h-[300px] transform transition-transform duration-1000 ${
                        animate ? "translate-x-30" : ""
                    }`}
                    alt=""
                />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
