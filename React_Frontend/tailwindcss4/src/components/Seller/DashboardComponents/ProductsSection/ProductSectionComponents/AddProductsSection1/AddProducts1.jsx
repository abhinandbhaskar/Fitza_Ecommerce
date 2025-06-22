import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProducts } from "../../../../../../redux/ProductsSlice";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProducts1 = ({ setCurrentView }) => {
  const { accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  

  const [formData, setFormData] = useState({
    product: "",
    description: "",
    category: "",
    brand: "",
    modelheight: "",
    wearing: "",
    instruction: "",
    about: "",
    weight:""
  });
  

  const [errors, setErrors] = useState({});
  

  const [catename, setCategoryname] = useState([]);
  const [brandname, setBrandname] = useState([]);

  const fetchCategory = async () => {
    try {
      const response = await axios.get("https://127.0.0.1:8000/api/seller/get_category/", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setCategoryname(response.data);
      console.log("Categ",response.data);
    } catch (errors) {
      console.log(errors);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get("https://127.0.0.1:8000/api/seller/get_brands/", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setBrandname(response.data);
    } catch (errors) {
      console.log(errors);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchBrands();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.product.trim()) newErrors.product = "Product name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.brand) newErrors.brand = "Brand is required";
    if (!formData.modelheight.trim()) newErrors.modelheight = "Model height is required";
    if (!formData.wearing.trim()) newErrors.wearing = "Model wearing is required";
    if (!formData.instruction.trim()) newErrors.instruction = "Care instructions are required";
    if (!formData.about.trim()) newErrors.about = "About information is required";
    if (!formData.weight.trim()) newErrors.weight = "Weight information is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddproduct1 = async () => {
    // Validate before proceeding
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      dispatch(updateProducts({
        products: formData.product,
        description: formData.description,
        cateid: formData.category,
        brandid: formData.brand,
        modelheight: formData.modelheight,
        modelwearing: formData.wearing,
        instruction: formData.instruction,
        about: formData.about,
        weight: formData.weight,
      }));
       toast.success("Product basic details saved");
      setTimeout(() => {
        setCurrentView("add2");
      }, 3000);
    } catch (error) {
      console.error("Error updating product data:", error);
      toast.error("Failed to save product data");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          <span className="text-indigo-600">Add Product</span>
        </h1>
      </header>

      <section className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
          Product Details
        </h2>

        <form className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="product" className="block text-gray-600 font-medium mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="product"
              name="product"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.product ? "border-red-500" : ""
              }`}
              placeholder="Enter product name"
              value={formData.product}
              onChange={handleChange}
            />
            {errors.product && (
              <p className="mt-1 text-sm text-red-600">{errors.product}</p>
            )}
          </div>

          {/* Product Description */}
          <div>
            <label htmlFor="description" className="block text-gray-600 font-medium mb-1">
              Product Description *
            </label>
            <textarea
              id="description"
              name="description"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.description ? "border-red-500" : ""
              }`}
              placeholder="Enter product description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-gray-600 font-medium mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.category ? "border-red-500" : ""
              }`}
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {catename.map((cate) => (
               <option key={cate.id} value={cate.id}>
                🔹 {cate.category.category_name} → {cate.subcategory_name}  ⮞ {cate.subcategory_description}
              </option>


              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Brand */}
          <div>
            <label htmlFor="brand" className="block text-gray-600 font-medium mb-1">
              Brand *
            </label>
            <select
              id="brand"
              name="brand"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.brand ? "border-red-500" : ""
              }`}
              value={formData.brand}
              onChange={handleChange}
            >
              <option value="">Select a brand</option>
              {brandname.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.brand_name}</option>
              ))}
            </select>
            {errors.brand && (
              <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="modelheight" className="block text-gray-600 font-medium mb-1">
                Model Height *
              </label>
              <input
                type="text"
                id="modelheight"
                name="modelheight"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.modelheight ? "border-red-500" : ""
                }`}
                placeholder="Enter model height"
                value={formData.modelheight}
                onChange={handleChange}
              />
              {errors.modelheight && (
                <p className="mt-1 text-sm text-red-600">{errors.modelheight}</p>
              )}
            </div>

            <div>
              <label htmlFor="wearing" className="block text-gray-600 font-medium mb-1">
                Model Wearing *
              </label>
              <input
                type="text"
                id="wearing"
                name="wearing"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.wearing ? "border-red-500" : ""
                }`}
                placeholder="Enter model wearing"
                value={formData.wearing}
                onChange={handleChange}
              />
              {errors.wearing && (
                <p className="mt-1 text-sm text-red-600">{errors.wearing}</p>
              )}
            </div>
          </div>

                    <div>
            <label htmlFor="product" className="block text-gray-600 font-medium mb-1">
              Product Weight *
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.product ? "border-red-500" : ""
              }`}
              placeholder="Enter product weight in gram"
              value={formData.weight}
              onChange={handleChange}
            />
            {errors.weight && (
              <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
            )}
          </div>

          {/* Care Instructions */}
          <div>
            <label htmlFor="instruction" className="block text-gray-600 font-medium mb-1">
              Care Instructions *
            </label>
            <textarea
              id="instruction"
              name="instruction"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.instruction ? "border-red-500" : ""
              }`}
              placeholder="Enter care instructions"
              rows="4"
              value={formData.instruction}
              onChange={handleChange}
            ></textarea>
            {errors.instruction && (
              <p className="mt-1 text-sm text-red-600">{errors.instruction}</p>
            )}
          </div>

          {/* About */}
          <div>
            <label htmlFor="about" className="block text-gray-600 font-medium mb-1">
              About *
            </label>
            <textarea
              id="about"
              name="about"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.about ? "border-red-500" : ""
              }`}
              placeholder="Enter additional product information"
              rows="4"
              value={formData.about}
              onChange={handleChange}
            ></textarea>
            {errors.about && (
              <p className="mt-1 text-sm text-red-600">{errors.about}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddproduct1}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring focus:ring-indigo-300"
            >
              Continue &gt;
            </button>
          </div>
        </form>
      </section>
       <ToastContainer/>
    </div>
  );
};

export default AddProducts1;
