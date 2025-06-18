import React, { useEffect, useState } from "react";
import "./Header.css";
import fitza from "../../../assets/fitzaapp.png";
import profile from "../../../assets/profile.jpg";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../redux/authSlice";
import { clearProfile } from "../../../redux/profileSlice";
import { useNavigate } from "react-router-dom";

const Header = ({ setCurrentView, countN, setCountN, setSearchTerm, searchTerm }) => {
    const { name, email, profilePicture } = useSelector((state) => state.profile.user);
    const { accessToken } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.post(
                "https://127.0.0.1:8000/api/admin/adminlogout/",
                {},
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            dispatch(logout());
            dispatch(clearProfile());
            navigate("/admin/adminlogin");
        } catch (errors) {
            console.log("Errors", errors);
        }
    };

    const fetchNotificationCount = async () => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/admin/unread_notifications/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setCountN(response.data.notifications);
        } catch (errors) {
            console.log("errors:", errors);
        }
    };

    useEffect(() => {
        fetchNotificationCount();
    }, []);

    const PageEvent = (e) => {
        if (e === "user") {
            setCurrentView("users");
        } else if (e === "seller") {
            setCurrentView("sellers");
        } else if (e === "product") {
            setCurrentView("products");
        } else {
            setCurrentView("mainsection");
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <header className="w-full bg-white shadow-md fixed top-0 z-50">
            {/* Mobile Header (shown only on small screens) */}
            <div className="md:hidden  flex items-center justify-between p-2 ">



                <div className="flex items-center">
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-white p-2"
                    >
                        <i className={`fa-solid ${isMobileMenuOpen ? "fa-xmark" : "fa-bars"}`}></i>
                    </button>
                    <img src={fitza} className="h-10 w-10 ml-2" alt="Fitza Logo" />
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button 
                            onClick={() => setCurrentView("notification")}
                            className="text-white p-2"
                        >
                            <i className="fa-solid fa-bell"></i>
                            {countN > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {countN}
                                </span>
                            )}
                        </button>
                    </div>
                    <div className="flex items-center">
                        <img
                            src={profilePicture && profilePicture.length > 0 ? `https://127.0.0.1:8000/media/${profilePicture}` : profile}
                            className="h-8 w-8 border-2 border-white rounded-full"
                            alt="Profile"
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-gray-100 p-4">
                    <div className="mb-4">
                        <select 
                            onChange={(e) => PageEvent(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        >
                            <option value="user">User</option>
                            <option value="seller">Seller</option>
                            <option value="product">Product</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <div className="flex items-center border border-gray-300 rounded-2xl shadow-sm bg-white px-3 py-2">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="flex-1 text-sm px-2 py-1 outline-none bg-transparent text-gray-800"
                            />
                            <button className="text-gray-500 hover:text-gray-700">
                                <svg
                                    xmlns="https://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-2 border-t border-gray-200">
                        <div className="flex items-center">
                            <img
                                src={profilePicture && profilePicture.length > 0 ? `https://127.0.0.1:8000/${profilePicture}` : profile}
                                className="h-10 w-10 border-2 border-gray-700 rounded-full"
                                alt="Profile"
                            />
                            
                            <div className="ml-3">
                                <h1 className="font-bold text-sm">{name}</h1>
                                <p className="text-gray-600 text-xs">{email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-red-500 hover:text-red-700 p-2"
                        >
                            <i className="fa-solid fa-right-from-bracket"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* Desktop Header (shown on medium screens and up) */}
            <div className="hidden md:flex w-full">
                <div className="w-1/4 md:w-[308px]  bg-gray-800  border-r border-gray-800 flex items-center justify-center p-2">
                    <img src={fitza} className="h-12 w-12" alt="Fitza Logo" />
                    <h1 className="text-xl text-white font-bold px-2">Fitza Admin</h1>
                </div>

                <div className="w-2/4 flex items-center justify-center p-2 bg-white">
                    <div className="flex items-center border border-gray-300 rounded-2xl shadow-sm bg-white px-3 py-2 w-full max-w-md">
                        <select 
                            onChange={(e) => PageEvent(e.target.value)}
                            className="text-sm text-gray-700 bg-white outline-none border-none mr-2"
                        >
                            <option value="user">User</option>
                            <option value="seller">Seller</option>
                            <option value="product">Product</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Enter seller name or shop name"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="flex-1 text-sm px-2 py-1 outline-none bg-transparent text-gray-800"
                        />
                        <button className="text-gray-500 hover:text-gray-700">
                            <svg
                                xmlns="https://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="w-1/4 flex items-center justify-end bg-white p-4">
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <button
                                onClick={() => setCurrentView("notification")}
                                className="text-gray-700 hover:text-gray-900"
                            >
                                <i className="fa-solid fa-bell text-2xl"></i>
                                {countN > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {countN}
                                    </span>
                                )}
                            </button>
                        </div>

                        <div className="flex items-center space-x-3">
                            <img
                                src={
                            profilePicture && profilePicture.length > 0 && `https://127.0.0.1:8000/media/${profilePicture}`
                        }
                                className="h-10 w-10 border-2 border-gray-700 rounded-full"
                                alt="Profile"
                            />
                            <div className="hidden lg:block">
                                <h1 className="font-bold text-sm">{name}</h1>
                                <p className="text-gray-600 text-xs">{email}</p>
                            </div>
                        </div>

 <div className="flex flex-col items-center justify-center ">
                    <div
                        onClick={handleLogout}
                        className="h-10 w-10 rounded-full border-2 hover:bg-black hover:border-2 hover:border-black hover:text-white border-gray-700 flex items-center justify-center"
                    >
                        <i className={`fa-solid fa-right-from-bracket`}></i>
                    </div>
                    <label htmlFor="" className="text-sm">
                        logout
                    </label>
                </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;