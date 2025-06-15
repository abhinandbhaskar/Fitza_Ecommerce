import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import {clearProducts,clearAttributes} from "../../../../../../redux/ProductsSlice";


const AddProducts3 = ({ setCurrentView }) => {
  const [img, setImage] = useState("");
  const [img1, setImage1] = useState("");
  const [img2, setImage2] = useState("");
  const [img3, setImage3] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const { accessToken } = useSelector((state) => state.auth);
  const { products, description, cateid, brandid, modelheight, modelwearing, instruction, about,weight, attributes } = useSelector(
    (state) => state.product?.product || {}
  );

  const validateForm = () => {
    const newErrors = {};
    
    if (!img) {
      newErrors.img = "Main image is required";
    }
    
 
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProduct3 = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("product", products);
    formData.append("description", description);
    formData.append("cateid", cateid);
    formData.append("brandid", brandid);
    formData.append("modelheight", modelheight);
    formData.append("modelwearing", modelwearing);
    formData.append("instruction", instruction);
    formData.append("about", about);
    formData.append("weight", weight);
    formData.append("attributes", JSON.stringify(attributes));
    formData.append("photo", img);
    if (img1) formData.append("img1", img1);
    if (img2) formData.append("img2", img2);
    if (img3) formData.append("img3", img3);

    try {
      const response = await axios.post(
        "https://127.0.0.1:8000/api/seller/add_product/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
     
      toast.success(response.data.message || "Product added successfully!");
      dispatch(clearProducts());
      dispatch(clearAttributes());
      setTimeout(() => {
        setCurrentView("add1");
      }, 3000);
    } catch (error) {
      console.error("Error adding product:", error);
      // toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleImageChange = (e, setImageFunction) => {
  const file = e.target.files[0];
  if (file) {
    // More comprehensive image validation
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
      toast.error("Please select a valid image file (JPEG, JPG, PNG, GIF, or WEBP)");
      return;
    }
    
    // Image size validation (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    
    // Revoke previous object URL if it exists
    if (setImageFunction === setImage && img) URL.revokeObjectURL(img);
    if (setImageFunction === setImage1 && img1) URL.revokeObjectURL(img1);
    if (setImageFunction === setImage2 && img2) URL.revokeObjectURL(img2);
    if (setImageFunction === setImage3 && img3) URL.revokeObjectURL(img3);
    
    setImageFunction(file);
  }
};



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
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <input
                  type="file"
                  id="main-image"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleImageChange(e, setImage)}
                  accept="image/*"
                />
                <label
                  htmlFor="main-image"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-indigo-700"
                >
                  {img ? "Change Main Image" : "Upload Main Image"}
                </label>
              </div>
              
              {img && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Preview:</h3>
                  <div className="w-64 h-64 border-2 border-gray-300 rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={URL.createObjectURL(img)}
                      alt="Main product preview"
                    />
                  </div>
                </div>
              )}
              
              {errors.img && (
                <p className="text-sm text-red-600">{errors.img}</p>
              )}
            </div>
            <p className="text-sm text-gray-500">Main image is the primary display image for the product.</p>
          </div>
        </section>

        {/* Sub Images Section */}
        <section className="bg-white p-6 shadow-sm rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Sub Images (Up to 3)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sub Image 1 */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <input
                  type="file"
                  id="sub-image-1"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleImageChange(e, setImage1)}
                  accept="image/*"
                />
                <label
                  htmlFor="sub-image-1"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-indigo-700"
                >
                  {img1 ? "Change Image 1" : "Upload Image 1"}
                </label>
              </div>
              
              {img1 && (
                <div className="mt-2 w-full">
                  <div className="w-48 h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={URL.createObjectURL(img1)}
                      alt="Sub product preview 1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sub Image 2 */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <input
                  type="file"
                  id="sub-image-2"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleImageChange(e, setImage2)}
                  accept="image/*"
                />
                <label
                  htmlFor="sub-image-2"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-indigo-700"
                >
                  {img2 ? "Change Image 2" : "Upload Image 2"}
                </label>
              </div>
              
              {img2 && (
                <div className="mt-2 w-full">
                  <div className="w-48 h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={URL.createObjectURL(img2)}
                      alt="Sub product preview 2"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sub Image 3 */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <input
                  type="file"
                  id="sub-image-3"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleImageChange(e, setImage3)}
                  accept="image/*"
                />
                <label
                  htmlFor="sub-image-3"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-indigo-700"
                >
                  {img3 ? "Change Image 3" : "Upload Image 3"}
                </label>
              </div>
              
              {img3 && (
                <div className="mt-2 w-full">
                  <div className="w-48 h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={URL.createObjectURL(img3)}
                      alt="Sub product preview 3"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Sub images provide additional views of the product. Ensure high-quality images are uploaded.
          </p>
        </section>

        {/* Submit Button */}
        <div className="text-right">
          <button
            onClick={handleAddProduct3}
            disabled={isSubmitting}
            className={`bg-green-600 text-white px-6 py-2 rounded-md text-lg font-medium hover:bg-green-700 shadow-md ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Product"}
          </button>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default AddProducts3;