import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
const AddProducts3 = ({setCurrentView}) => {
  const[img,setImage]=useState("");
  const[img1,setImage1]=useState("");
  const[img2,setImage2]=useState("");
  const[img3,setImage3]=useState("");
  const {accessToken} = useSelector((state)=>state.auth);
  const { products,description,cateid,brandid,modelheight,modelwearing,instruction,about,colorid,sizeid,price,stock} = useSelector((state) => state.product?.product || {});

  const handleAddProduct3=async()=>{

    const productsData={
      "product":products,
      "description":description,
      "cateid":cateid,
      "brandid":brandid,
      "modelheight":modelheight,
      "modelwearing":modelwearing,
      "instruction":instruction,
      "about":about,
      "color":colorid,
      "size":sizeid,
      "price":price,
      "stock":stock,
      "photo":img,
      "img1":img1,
      "img2":img2,
      "img3":img3,
    }
    console.log(productsData);


    try{
      const response=await axios.post("https://127.0.0.1:8000/api/seller/add_product/",productsData,{
        headers:{
          "Content-Type": "multipart/form-data",
          Authorization:`Bearer ${accessToken}`,
        }
      });
      console.log(response);
      console.log(response.data);
      alert(response.data.message);
      setTimeout(()=>{
        setCurrentView("add1");
      },3000)
    }
    catch(errors)
    {
      console.log(errors);
      console.log(errors.response.data);
    }

  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Dashboard &gt; <span className="text-indigo-600">Add Product Images</span>
        </h1>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Main Image Section */}
        <section className="bg-white p-6 shadow-sm rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Main Image</h2>
          <div className="flex flex-col items-start gap-2">
            <label
              htmlFor="main-image"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-indigo-700"
            >
              Upload Main Image
            </label>
            <div className="relative inline-block">
  <input
    type="file"
    id="fileInput"
    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        setImage(file); // Set the selected file for submission
      }
    }}
  />
  <label
    htmlFor="fileInput"
    className="bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center w-[180px] m-2 p-3 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer"
  >
    <img
      className="h-[120px] w-[120px] rounded-lg border-2 border-white"
      src={
        img instanceof File
          ? URL.createObjectURL(img) // Preview the selected file temporarily
          : img // Show existing profile photo URL
      }
      alt="Profile Picture"
    />
    <div className="ml-3 flex items-center justify-center bg-white text-amber-700 rounded-lg h-[60px] w-[60px] shadow-md hover:bg-amber-300 transition-colors duration-300">
      <i className="fa-solid fa-camera"></i>
    </div>
  </label>
</div>


            <p className="text-sm text-gray-500">Main image is the primary display image for the product.</p>
          </div>
        </section>

       
        <section className="bg-white p-6 shadow-sm rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Sub Images (Up to 3)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
          <div className="relative inline-block">
                            <input
                                type="file"
                                id="fileInput"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      setImage1(file); // Set the selected file for submission
                                    }
                                }}
                            />
                            <label
                                htmlFor="fileInput"
                                className="bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center w-[120px] m-2 p-1 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                            >
                                <img
                                    className="h-[40px] w-[40px] rounded-full border-2 border-white"
                                    src={
                                        img1 instanceof File
                                            ? URL.createObjectURL(img1) // Preview the selected file temporarily
                                            : img1 // Show existing profile photo URL
                                    }
                                    alt="Profile Picture"
                                />
                                <div className="ml-3 flex items-center justify-center bg-white text-amber-700 rounded-full h-[40px] w-[40px] shadow-md hover:bg-amber-300 transition-colors duration-300">
                                    <i className="fa-solid fa-camera"></i>
                                </div>
                            </label>
            </div>


            <div className="relative inline-block">
                            <input
                                type="file"
                                id="fileInput"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      setImage2(file); // Set the selected file for submission
                                    }
                                }}
                            />
                            <label
                                htmlFor="fileInput"
                                className="bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center w-[120px] m-2 p-1 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                            >
                                <img
                                    className="h-[40px] w-[40px] rounded-full border-2 border-white"
                                    src={
                                        img2 instanceof File
                                            ? URL.createObjectURL(img2) // Preview the selected file temporarily
                                            : img2 // Show existing profile photo URL
                                    }
                                    alt="Profile Picture"
                                />
                                <div className="ml-3 flex items-center justify-center bg-white text-amber-700 rounded-full h-[40px] w-[40px] shadow-md hover:bg-amber-300 transition-colors duration-300">
                                    <i className="fa-solid fa-camera"></i>
                                </div>
                            </label>
            </div>

            <div className="relative inline-block">
                            <input
                                type="file"
                                id="fileInput"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      setImage3(file); // Set the selected file for submission
                                    }
                                }}
                            />
                            <label
                                htmlFor="fileInput"
                                className="bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center w-[120px] m-2 p-1 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                            >
                                <img
                                    className="h-[40px] w-[40px] rounded-full border-2 border-white"
                                    src={
                                        img3 instanceof File
                                            ? URL.createObjectURL(img3) // Preview the selected file temporarily
                                            : img3 // Show existing profile photo URL
                                    }
                                    alt="Profile Picture"
                                />
                                <div className="ml-3 flex items-center justify-center bg-white text-amber-700 rounded-full h-[40px] w-[40px] shadow-md hover:bg-amber-300 transition-colors duration-300">
                                    <i className="fa-solid fa-camera"></i>
                                </div>
                            </label>
            </div>
         
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Sub images provide additional views of the product. Ensure high-quality images are uploaded.
          </p>
        </section>

     
        <div className="text-right">
          <button

            onClick={()=>handleAddProduct3()}
            className="bg-green-600 text-white px-6 py-2 rounded-md text-lg font-medium hover:bg-green-700 shadow-md"
          >
            Submit Product
          </button>
        </div>
      </main>
    </div>
  );
};

export default AddProducts3;