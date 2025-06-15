import React, { useState } from "react";
import "./BannerSection.css";
import axios from "axios";
import { format } from "date-fns";
import { useSelector } from "react-redux";
const BannerSection = () => {
    const [currentView, setCurrentView] = useState("add");

    const [image, setImage] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [offer, setOffer] = useState("");
    const [startdate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const { accessToken } = useSelector((state) => state.auth);
    const [bannerData, setBannerData] = useState([]);
    const [banid,setBanid]=useState("");

    const AddBanner = async () => {
        if (!image || !title || !description || !offer || !startdate || !endDate) {
            alert("Please fill in all fields!");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("offer", offer);
        formData.append("startdate", startdate);
        formData.append("endDate", endDate);

        try {
            const response = await axios.post("https://127.0.0.1:8000/api/admin/add_banner/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response);
            console.log(response.data);
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }

        console.log("Banner Data Submitted:", formData);
        // Handle API submission here
    };

    const ViewBanners = async () => {
        setCurrentView("view");

        try {
            const response = await axios.get("https://127.0.0.1:8000/api/admin/get_banners/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response);
            console.log(response.data);
            setBannerData(response.data);
        } catch (errors) {
            console.log("Error", errors);
            console.log("Error", errors.response.data);
        }
    };

    const DeleteBanner=async(id)=>{
        console.log(id);

        try {
            const response = await axios.post(`https://127.0.0.1:8000/api/admin/delete_banner/${id}/`,{},{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
    
            });
            console.log(response);
            console.log(response.data);
            alert("Banner Deleted..");
            ViewBanners();
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }

    }


    const EditBannersData=async(id)=>{
        setCurrentView("edit");

        try {
            const response = await axios.get(`https://127.0.0.1:8000/api/admin/edit_banner_data/${id}/`, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response);
            console.log("INT",response.data);
            
            setImage(response.data.image);
            setTitle(response.data.title);
            setDescription(response.data.description);
            setOffer(response.data.offer_details);
            setStartDate(response.data.start_date);
            setEndDate(response.data.end_date);
            setBanid(response.data.id);


        } catch (errors) {
            console.log("Error", errors);
            console.log("Error", errors.response.data);
        }


    }



    // updatebanner

    const UpdateBanner = async (id) => {
        if (!image || !title || !description || !offer || !startdate || !endDate) {
            alert("Please fill in all fields!");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("offer", offer);
        formData.append("startdate", startdate);
        formData.append("endDate", endDate);

        try {
            const response = await axios.post(`https://127.0.0.1:8000/api/admin/update_banner/${id}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response);
            console.log(response.data);
            alert(response.data.message);
            ViewBanners();
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }

        console.log("Banner Data Submitted:", formData);
        console.log("Banner Data Submitted:", id);
        // Handle API submission here
    };

       const ClickActivate=async(id)=>{

                try {
            const response = await axios.post(`https://127.0.0.1:8000/api/admin/activate_banner/${id}/`,{},{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
    
            });
            console.log(response);
            console.log(response.data);
            alert("Banner Activated..");
            ViewBanners();
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }

        
                
        }

        const ClickDeactivate=async(id)=>{
            console.log("Deactivate",id);

                    try {
            const response = await axios.post(`https://127.0.0.1:8000/api/admin/deactivate_banner/${id}/`,{},{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
    
            });
            console.log(response);
            console.log(response.data);
            alert("Banner Deactivated..");
            ViewBanners();
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
            
    }
    




    return (
        <div className="h-auto min-h-screen bg-gray-100">
            {/* Header */}
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    Dashboard &gt; <span className="text-indigo-600">Banner</span>
                </h1>
            </div>

            <div className="flex flex-row pl-28 pt-10 gap-4">
                <button
                    onClick={() => setCurrentView("add")}
                     className="px-4 py-2  bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                >
                    Add Banner
                </button>
                <button onClick={() => ViewBanners()}
                  className="px-4 py-2  bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1">
                    View Banners
                </button>
            </div>

            {currentView === "add" && (
                <>
                    <div className="h-auto w-full bg-white p-5 flex items-center justify-center flex-col">
                        <div
                            className="banner-container1 rounded-lg overflow-hidden bg-cover bg-center shadow-lg relative"
                            style={{
                                backgroundImage:
                                    image instanceof File
                                        ? `url(${URL.createObjectURL(image)})`
                                        : `url(${image || "/src/assets/MainBanner/MainBanner.jpg"})`,
                            }}
                            aria-label="Promotional Banner"
                        >
                            <div className="banner-content1">
                                <div className="left-section1">
                                    <h1 className="banner-title1">{title || "Spring Sale is Here!"}</h1>
                                    <p className="banner-description1">
                                        {description ||
                                            " Celebrate the season with fresh styles and vibrant colors. Limited stock available!"}
                                    </p>
                                    <h4 className="banner-offer1">{offer || "Flat 30% off on all dresses."}</h4>
                                    <div className="banner-dates1">
                                        <span>
                                            <strong>Start Date:</strong> {startdate || "2025-04-01"}
                                        </span>
                                        <span>
                                            <strong>End Date:</strong> {endDate || "2025-04-30"}
                                        </span>
                                    </div>
                                    <button className="shop-now-btn1">SHOP NOW</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 mt-6 mx-4 md:mx-auto md:w-2/3">
                        <h1 className="text-2xl font-bold mb-4 text-gray-700">Add New Banner</h1>

                        <div className="flex flex-col md:flex-row gap-4">
                            <label className="flex-1">
                                <span className="text-sm font-semibold text-gray-600">Image:</span>
                                <input
                                    type="file"
                                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setImage(file); // Set the selected file for submission
                                        }
                                    }}
                                />
                            </label>
                            <label className="flex-1">
                                <span className="text-sm font-semibold text-gray-600">Title:</span>
                                <input
                                    type="text"
                                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                            <label className="flex-1">
                                <span className="text-sm font-semibold text-gray-600">Description:</span>
                                <input
                                    type="text"
                                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </label>
                            <label className="flex-1">
                                <span className="text-sm font-semibold text-gray-600">Offer Details:</span>
                                <input
                                    type="text"
                                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={offer}
                                    onChange={(e) => setOffer(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                            <label className="flex-1">
                                <span className="text-sm font-semibold text-gray-600">Start Date:</span>
                                <input
                                    type="date"
                                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={startdate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </label>
                            <label className="flex-1">
                                <span className="text-sm font-semibold text-gray-600">End Date:</span>
                                <input
                                    type="date"
                                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className="text-center p-4">
                            <button
                                type="submit"
                                onClick={(event) => {
                                    event.preventDefault();
                                    AddBanner();
                                }}
                                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
                            >
                                Submit Banner
                            </button>
                        </div>
                    </div>
                </>
            )}

        

            {currentView === "view" &&
                bannerData.map((value, key) => (
                    <>
                        <div className="h-auto w-full bg-white p-5 flex items-center justify-center flex-col">
                            <div className="w-[80%] p-2 mt-4 border border-gray-300 shadow-md flex justify-end gap-2 rounded-lg bg-gray-100">
                                <button className={` px-4 py-2 ${value.is_active?"bg-green-600":"bg-red-600"} text-white font-medium rounded-lg shadow  transition-all`}>
                                    {value.is_active?"Its Active":"It's Deactive"} 
                                </button>
                            </div>

                            <div
                                className="banner-container1 rounded-lg overflow-hidden bg-cover bg-center shadow-lg relative"
                                style={{
                                    backgroundImage: `url(${
                                        "https://127.0.0.1:8000/" + value.image || "/src/assets/MainBanner/MainBanner.jpg"
                                    })`,
                                }}
                            >
                                <div className="banner-content1">
                                    <div className="left-section1">
                                        <h1 className="banner-title1">{value.title || "Spring Sale is Here!"}</h1>
                                        <p className="banner-description1">
                                            {value.description ||
                                                "Celebrate the season with fresh styles and vibrant colors. Limited stock available!"}
                                        </p>
                                        <h4 className="banner-offer1">
                                            {value.offer_details || "Flat 30% off on all dresses."}
                                        </h4>
                                        <div className="banner-dates1">
                                            <span>
                                                <strong>Start Date:</strong>
                                                {format(new Date(value.start_date), "MMMM d, yyyy ") || " 2025-04-01"}
                                            </span>
                                            <span>
                                                <strong>End Date:</strong>{" "}
                                                {format(new Date(value.end_date), "MMMM d, yyyy ") || " 2025-04-01"}
                                            </span>
                                        </div>
                                        <button className="shop-now-btn1">SHOP NOW</button>
                                    </div>
                                </div>
                            </div>
      <div className="w-3/4 p-4 mt-6 border border-gray-200 shadow-sm flex justify-end gap-3 rounded-md bg-white">
    <button 
        onClick={() => ClickActivate(value.id)} 
        className="px-4 py-2 bg-green-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
    >
        Activate
    </button>
    <button 
        onClick={() => ClickDeactivate(value.id)} 
        className="px-4 py-2 bg-amber-500 text-white font-medium text-sm rounded-md shadow-sm hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
    >
        Deactivate
    </button>
    <button 
        onClick={() => EditBannersData(value.id)} 
        className="px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
    >
        Edit
    </button>
    <button 
        onClick={() => DeleteBanner(value.id)} 
        className="px-4 py-2 bg-red-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
    >
        Delete
    </button>
</div>
                        </div>
                    </>
            ))}


{currentView === "edit" && (
                <>
                    <div className="h-auto w-full bg-white p-5 flex items-center justify-center flex-col">
                        <div
                            className="banner-container1 rounded-lg overflow-hidden bg-cover bg-center shadow-lg relative"
                            style={{
                                backgroundImage:
                                    image instanceof File
                                        ? `url(${URL.createObjectURL(image)})`
                                        : `url(${"https://127.0.0.1:8000/"+image || "/src/assets/MainBanner/MainBanner.jpg"})`,
                            }}
                            aria-label="Promotional Banner"
                        >
                            <div className="banner-content1">
                                <div className="left-section1">
                                    <h1 className="banner-title1">{title || "Spring Sale is Here!"}</h1>
                                    <p className="banner-description1">
                                        {description ||
                                            " Celebrate the season with fresh styles and vibrant colors. Limited stock available!"}
                                    </p>
                                    <h4 className="banner-offer1">{offer || "Flat 30% off on all dresses."}</h4>
                                    <div className="banner-dates1">
                                        <span>
                                            <strong>Start Date:</strong> {startdate || "2025-04-01"}
                                        </span>
                                        <span>
                                            <strong>End Date:</strong> {endDate || "2025-04-30"}
                                        </span>
                                    </div>
                                    <button className="shop-now-btn1">SHOP NOW</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 mt-6 mx-4 md:mx-auto md:w-2/3">
                        <h1 className="text-2xl font-bold mb-4 text-gray-700">Update Banner</h1>

                        <div className="flex flex-col md:flex-row gap-4">
                            <label className="flex-1">
                                <span className="text-sm font-semibold text-gray-600">Image:</span>
                                <input
                                    type="file"
                                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setImage(file); // Set the selected file for submission
                                        }
                                    }}
                                />
                            </label>
                            <label className="flex-1">
                                <span className="text-sm font-semibold text-gray-600">Title:</span>
                                <input
                                    type="text"
                                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                            <label className="flex-1">
                                <span className="text-sm font-semibold text-gray-600">Description:</span>
                                <input
                                    type="text"
                                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </label>
                            <label className="flex-1">
                                <span className="text-sm font-semibold text-gray-600">Offer Details:</span>
                                <input
                                    type="text"
                                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={offer}
                                    onChange={(e) => setOffer(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                            <label className="flex-1">
                                <span className="text-sm font-semibold text-gray-600">Start Date:</span>
                                <input
                                    type="date"
                                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={startdate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </label>
                            <label className="flex-1">
                                <span className="text-sm font-semibold text-gray-600">End Date:</span>
                                <input
                                    type="date"
                                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className="text-center">
                            <button
                                type="submit"
                                onClick={(event) => {
                                    event.preventDefault();
                                    UpdateBanner(banid);
                                }}
                                className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition shadow-md"
                            >
                                Update Banner
                            </button>
                        </div>
                    </div>
                </>
            )}

        </div>
    );
};

export default BannerSection;
