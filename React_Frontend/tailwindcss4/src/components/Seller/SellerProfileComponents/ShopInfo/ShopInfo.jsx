import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const ShopInfo = ({ setCurrentView }) => {
    const { accessToken } = useSelector((state) => state.auth);

    const [banner, setBanner] = useState("");
    const [logo, setLogo] = useState("");
    const [shopname, setShopname] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [taxid, setTaxid] = useState("");
    const [regno, setRegno] = useState("");
    const [description, setDescription] = useState("");

    const fetchShop = async () => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/seller/shop_details/", {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response.data);
            const data = response.data;
            setShopname(data.shop_name);
            setAddress(data.shop_address);
            setPhone(data.contact_number);
            setEmail(data.email);
            setTaxid(data.tax_id);
            setRegno(data.business_registration_number);
            setDescription(data.description);
            const shoplogo1="https://127.0.0.1:8000"+data.shop_logo
            console.log("SHLOGO",shoplogo1);
            setLogo(shoplogo1||"https://127.0.0.1:8000/media/seller/logo1.jpg");
            const shopbanner1="https://127.0.0.1:8000"+data.shop_banner
            console.log("SHBAN",shopbanner1);
            setBanner(shopbanner1||"https://127.0.0.1:8000/media/seller/shopbanner.jpg");
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };
    useEffect(() => {
        fetchShop();
    }, []);

    const handleBannerUpload = () => {
        // Logic for handling banner upload
    };

    const handleLogoUpload = () => {
        // Logic for handling logo upload
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("banner", banner);
        formData.append("logo", logo);
        formData.append("shopname", shopname);
        formData.append("shopaddress", address);
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("taxid", taxid);
        formData.append("registerno", regno);
        formData.append("description", description);
        console.log("FormData Content:");
        formData.forEach((value, key) => {
          console.log(key, value);
        });

        try{
          const response=await axios.post("https://127.0.0.1:8000/api/seller/update_shop/",formData,{
            headers:{
              "Content-Type": "multipart/form-data",
              "Authorization":`Bearer ${accessToken}`,
            }
          });
          console.log(response);
          console.log(response.data);
          alert(response.data.message);

        }catch(errors)
        {
          console.log(errors);
          console.log(errors.response.data);
        }

    };


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            {/* Breadcrumb */}
            <div className="w-full bg-white shadow-md p-4">
                <h1 className="text-lg font-semibold text-gray-700">
                    Dashboard &gt; <span className="text-blue-500">Shop Details</span>
                </h1>
            </div>

            {/* Content Section */}
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl mt-6 p-6">
                {/* Navigation Tabs */}
                <div className="flex justify-around mb-6">
                    <button
                        onClick={() => setCurrentView("profile")}
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setCurrentView("shopinfo")}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Shop Details
                    </button>
                    <button
                        onClick={() => setCurrentView("bankinfo")}
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                        Bank Details
                    </button>
                </div>

                {/* Shop Banner */}
                <div className="relative mb-6">
                    <input
                        type="file"
                        id="bannerUpload"
                        className="hidden"
                        
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setBanner(file); // Set the selected file for submission
                          }
                      }}
                    />
                    <div
                        className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer"
                        onClick={() => document.getElementById("bannerUpload").click()} // Trigger the hidden input's click
                    >
                        <img 
                          src={
                            banner instanceof File
                                ? URL.createObjectURL(banner) // Preview the selected file temporarily
                                :banner
                                // : "https://127.0.0.1:8000/media/seller/shopbanner.jpg" // Show existing profile photo URL
                        }
                        
                        alt="Shop Banner" className="object-cover w-full h-full" />
                        <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                            <span className="text-white font-semibold">Update Banner</span>
                        </div>
                    </div>
                </div>

                {/* Shop Logo */}
                <div className="relative mb-6 flex justify-center">
                    <input
                        type="file"
                        id="logoUpload"
                        className="hidden"
                        
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setLogo(file); // Set the selected file for submission
                          }
                      }}
                    />
                    <div
                        className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden cursor-pointer relative"
                        onClick={() => document.getElementById("logoUpload").click()} // Trigger the hidden input's click
                    >
                        <img 
                         src={
                            logo instanceof File
                                ? URL.createObjectURL(logo) // Preview the selected file temporarily
                                :logo
                                // : "https://127.0.0.1:8000/media/seller/logo1.jpg" // Show existing profile photo URL
                        }
                        alt="Shop Logo" className="object-cover w-full h-full" />
                        <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                            <span className="text-white font-semibold">Update Logo</span>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
                        <input
                            type="text"
                            className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter shop name"
                            value={shopname}
                            onChange={(e) => setShopname(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Shop Address</label>
                        <input
                            type="text"
                            className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter shop address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                        <input
                            type="text"
                            className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter contact number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Shop Email</label>
                        <input
                            type="text"
                            className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter shop email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                        <input
                            type="text"
                            className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter tax ID"
                            value={taxid}
                            onChange={(e) => setTaxid(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Register Number</label>
                        <input
                            type="text"
                            className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter business register number"
                            value={regno}
                            onChange={(e) => setRegno(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Shop Description</label>
                        <textarea
                            className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                            placeholder="Enter shop description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShopInfo;
