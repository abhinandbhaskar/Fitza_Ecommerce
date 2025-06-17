import React, { useEffect, useState } from "react";
import "./ViewProfile.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch} from "react-redux";
import { updateProfile } from "../../../../redux/profileSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { safe } from "../../../../utils/safeAccess";

const ViewProfile = () => {
    const [profileData, setProfileData] = useState("");
    const [error, setError] = useState("");
    const [fullName, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [photo, setPhoto] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { accessToken } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("https://127.0.0.1:8000/api/profile/", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setProfileData(data);
                    setFullname(safe(data,'first_name') || "");
                    setEmail(safe(data,'email') || "");
                    setPhone(safe(data,'phone_number') || "");
                    const imageLink = "https://127.0.0.1:8000" + safe(data,'userphoto');
                    setPhoto(imageLink || "");


                } else {
                    setError("Failed to fetch profile data.");
                }
            } catch (err) {
                setError("Something went wrong.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [accessToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!fullName || !email || !phone) {
            setError("All fields are required.");
            return;
        }

        const formData = new FormData();

        // Add profile fields
        formData.append("fullname", fullName.trim());
        formData.append("email", email.trim());
        formData.append("phone", phone.trim());

        // Check if a new file was uploaded
        if (photo instanceof File) {
            formData.append("photo", photo); // Add the photo file
        }


        setIsLoading(true);

        try {
            const response = await axios.post(
                "https://127.0.0.1:8000/api/profileupdate/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if (response.status === 200) {
                // alert(response.data.message);
                toast.success(response.data.message);

                dispatch(
                    updateProfile({
                        name: fullName,
                        email: email,
                        profilePicture: photo instanceof File ? URL.createObjectURL(photo) : photo,
                      })
                );
                navigate("/profile");


            } else {
                setError("Failed to update profile. Please try again.");
            }
        } catch (errors) {
            console.error("Error updating profile", errors);
            
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full w-[100%] p-10 flex flex-col">
            <div className="h-[100px] w-[100%] m-2 flex flex-row justify-start items-center">
                <div>
                    <i className="fa-solid fa-user text-4xl p-6"></i>
                </div>
                <h1 className="text-4xl font-bold">User Profile</h1>
            </div>

            {error && (
                <div className="text-red-600 mb-4 text-center">{error}</div>
            )}

            <form>
                <div className="h-[100%] w-[100%] m-2 flex flex-col items-center">
                    <div className="h-full w-[100%] font-bold text-md m-1 flex flex-col">
                        <label className="flex justify-start" htmlFor="fullName">
                            Full Name:
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            className="block w-10/12 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                            placeholder="Your Full Name"
                            value={fullName}
                            onChange={(e) => setFullname(e.target.value)}
                        />
                    </div>

                    <div className="h-full w-[100%] font-bold text-md m-1 flex flex-col">
                        <label className="flex justify-start" htmlFor="email">
                            Email Address:
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="block w-10/12 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            readOnly
                        />
                    </div>

                    <div className="h-full w-[100%] font-bold text-md m-1 flex flex-col">
                        <label className="flex justify-start" htmlFor="phone">
                            Mobile Number:
                        </label>
                        <input
                            type="text"
                            id="phone"
                            className="block w-10/12 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                            placeholder="Mobile Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
<div className="h-full w-[100%] font-bold text-md m-1 flex flex-col">
    <label className="flex justify-start text-sm text-blue-600" htmlFor="fileInput">
        Update Profile Picture:
    </label>

    <div className="relative inline-block group">
        <input
            type="file"
            id="fileInput"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                    setPhoto(file);
                }
            }}
            accept="image/*"
        />
        <label
            htmlFor="fileInput"
            className="bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center w-[120px] m-2 p-1 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer relative"
        >
            <img
                className="h-[40px] w-[40px] rounded-full border-2 border-white"
                src={
                    photo instanceof File
                        ? URL.createObjectURL(photo)
                        : photo || "https://via.placeholder.com/40" // fallback if no photo
                }
                alt="Profile Picture"
            />
            <div className="ml-3 flex items-center justify-center bg-white text-amber-700 rounded-full h-[40px] w-[40px] shadow-md hover:bg-amber-300 transition-colors duration-300">
                <i className="fa-solid fa-camera"></i>
            </div>
            
            {/* Hover Preview */}
            <div className="absolute -top-40 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                <div className="bg-white w-34 h-34 p-2 rounded-lg shadow-xl border border-gray-200">
                    <img
                        className="h-32 w-32 rounded-full object-cover border-2 border-gray-300"
                        src={
                            photo instanceof File
                                ? URL.createObjectURL(photo)
                                : photo || "https://via.placeholder.com/128"
                        }
                        alt="Profile Preview"
                    />
                    <div className="text-xs text-center mt-1 text-gray-600">
                        Hover Preview
                    </div>
                </div>
            </div>
        </label>
    </div>
</div>

                    <div className="h-full w-[100%] m-1">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-blue-500 px-4 py-2 rounded-lg text-white text-md hover:bg-blue-700 ml-6"
                            disabled={isLoading}
                        >
                            {isLoading ? "Updating..." : "Update Profile"}
                        </button>
                    </div>
                </div>
            </form>
            <ToastContainer /> 
        </div>
    );
};

export default ViewProfile;
