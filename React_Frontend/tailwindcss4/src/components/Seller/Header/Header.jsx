import React, { useEffect, useState } from "react";
import fitza from "../../../assets/fitzaapp.png";
import profile from "../../../assets/profile.jpg";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../redux/authSlice";
import { clearProfile } from "../../../redux/profileSlice";
import { useNavigate } from "react-router-dom";

const Header = ({ setCurrentView, countN, setCountN }) => {
    const { name, email, profilePicture } = useSelector((state) => state.profile.user);
    const { accessToken } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = async () => {
        console.log("FFF", accessToken);
        try {
            await axios.post(
                "https://127.0.0.1:8000/api/seller/seller_logout/",
                {},
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            dispatch(
                logout({
                    userId: null,
                    accessToken: null,
                    isAuthenticated: false,
                })
            );
            dispatch(
                clearProfile({
                    name: null,
                    email: null,
                    profilePicture: null,
                })
            );
            navigate("/seller/loginpage");
        } catch (errors) {
            console.log("Errors", errors);
        }
    };

    const fetchNotificationCount = async () => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/seller/seller_unread_notifications/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log("KAKAKAKAK", response);
            setCountN(response.data.notifications);
        } catch (errors) {
            console.log("errors:", errors);
            console.log("errors:", errors.response.data);
        }
    };

    useEffect(() => {
        fetchNotificationCount();
    }, []);

    return (
        <div className="w-full bg-gray-900 flex flex-col md:flex-row fixed border-b-1 z-10 mb-10">
            <div className="w-full md:w-[390px] bg-gray-800 border-b md:border-r border-gray-800 flex items-center justify-center p-2">
                <img src={fitza} className="h-12 w-12" alt="Fitza Logo" />
                <h1 className="text-xl md:text-2xl text-white font-bold px-2">Fitza Seller</h1>
            </div>

            <div className="w-full md:w-3/4 flex flex-col md:flex-row bg-white ">
                <div className="w-full md:w-2/5 p-2 flex items-center justify-center"></div>
                <div className="w-full md:w-2/5 p-2 flex items-center justify-center">
                    <div className="flex items-center border border-gray-300 rounded-2xl shadow-sm bg-white px-3 py-2 w-full max-w-md">
                        <select className="text-sm text-gray-700 bg-white outline-none border-none mr-2">
                            <option>User</option>
                            <option>Seller</option>
                            <option>Product</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Search..."
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

                <div
                    onClick={() => setCurrentView("notification")}
                    className="w-full md:w-3/5 flex flex-wrap items-center justify-center md:justify-start gap-4 px-4 py-2"
                >
                    <div className="relative">
                        <div
                            key=""
                            className="h-10 w-10 rounded-full border-2 hover:bg-gray-500 border-gray-700 flex items-center justify-center"
                        >
                            <i className="fa-solid fa-bell"></i>
                        </div>
                        {/* Notification counter badge */}
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {countN}
                        </div>
                    </div>
                </div>

                {/* <div className="w-full md:w-3/5 flex flex-wrap items-center justify-center md:justify-start gap-4 px-4 py-2">
                    <div
                        key=""
                        className="h-10 w-10 rounded-full border-2 hover:bg-gray-500 border-gray-700 flex items-center justify-center"
                    >
                        <i className="fa-solid fa-gear"></i>
                    </div>
                </div>

                <div className="w-full md:w-3/5 flex flex-wrap items-center justify-center md:justify-start gap-4 px-4 py-2">
                    <div
                        key=""
                        className="h-10 w-10 rounded-full border-2 hover:bg-gray-500 border-gray-700 flex items-center justify-center"
                    >
                        <i className="fa-solid fa-circle-info"></i>
                    </div>
                </div> */}
            </div>

            <div className="w-full md:w-1/4 flex items-center gap-2 bg-white border-t md:border-t-0 md:border-l border-gray-600 p-4">
                <div
                    onClick={() => setCurrentView("profile")}
                    className="flex flex-row bg-white hover:bg-gray-100  p-2 border-1 border-gray-200 shadow-2xl rounded-xl"
                >
                    <img
                        src={
                            profilePicture && profilePicture.length > 0 && `https://127.0.0.1:8000/media/${profilePicture}`
                        }
                        className="h-12 w-12 border-2 border-gray-700 rounded-full"
                        alt="Profile"
                    />
                    <div className="flex flex-col text-sm">
                        <p className="text-sm text-blue-700 px-2">profile</p>
                        {/* <h1 className="font-bold w-[12ch] truncate">{name}</h1> */}
                        <p className="text-gray-600 w-[14ch] truncate px-1">{email}</p>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center ml-6">
                    <div
                        onClick={handleLogout}
                        className="h-10 w-10 rounded-full border-2 hover:bg-red-500 hover:border-2 hover:border-black hover:text-white border-gray-700 flex items-center justify-center"
                    >
                        <i className={`fa-solid fa-right-from-bracket`}></i>
                    </div>
                    <label htmlFor="" className="text-sm">
                        logout
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Header;
