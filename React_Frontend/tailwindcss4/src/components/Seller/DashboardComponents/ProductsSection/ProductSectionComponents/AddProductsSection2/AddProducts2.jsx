import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProducts, addProductAttribute } from "../../../../../../redux/ProductsSlice";
import { toast } from "react-toastify"; // For showing error messages
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProducts2 = ({ setCurrentView }) => {
    const { products, description, cateid, brandid, modelheight, modelwearing, instruction, about, weight,attributes } =
        useSelector((state) => state.product?.product || {});

    const { accessToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [color, setColor] = useState([]);
    const [size, setSize] = useState([]);
    const [errors, setErrors] = useState({});
    const [formSubmitted, setFormSubmitted] = useState(false);

    const [currentAttribute, setCurrentAttribute] = useState({
        colorid: "",
        sizeid: "",
        price: "",
        stock: "",
    });

    const fetchColor = async () => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/seller/get_color/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setColor(response.data);
        } catch (errors) {
            console.log(errors);
        }
    };

    const fetchSize = async () => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/seller/get_size/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setSize(response.data);
        } catch (errors) {
            console.log(errors);
        }
    };

    useEffect(() => {
        fetchColor();
        fetchSize();
    }, []);

    const validateAttribute = () => {
        const newErrors = {};
        
        if (!currentAttribute.colorid) {
            newErrors.colorid = "Color is required";
        }
        
        if (!currentAttribute.sizeid) {
            newErrors.sizeid = "Size is required";
        }
        
        if (!currentAttribute.price) {
            newErrors.price = "Price is required";
        } else if (isNaN(currentAttribute.price) || parseFloat(currentAttribute.price) <= 0) {
            newErrors.price = "Price must be a positive number";
        }
        
        if (!currentAttribute.stock) {
            newErrors.stock = "Stock is required";
        } else if (isNaN(currentAttribute.stock) || parseInt(currentAttribute.stock) < 0) {
            newErrors.stock = "Stock must be a non-negative integer";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddAttribute = () => {
        setFormSubmitted(true);
        if (validateAttribute()) {
            dispatch(addProductAttribute(currentAttribute));
            setCurrentAttribute({ colorid: "", sizeid: "", price: "", stock: "" });
            setErrors({});
            setFormSubmitted(false);
        }
    };

    const validateBeforeContinue = () => {
        if (attributes.length === 0) {
            setErrors({...errors, attributes: "At least one attribute combination is required"});
            return false;
        }
        return true;
    };

    const handleAddProduct2 = async () => {
        if (!validateBeforeContinue()) return;
        
        try {
            dispatch(
                updateProducts({
                    products: products,
                    description: description,
                    cateid: cateid,
                    brandid: brandid,
                    modelheight: modelheight,
                    modelwearing: modelwearing,
                    instruction: instruction,
                    about: about,
                    weight:weight
                })
            );
            console.log("Product data updated successfully");
            setCurrentAttribute({ colorid: "", sizeid: "", price: "", stock: "" });
            toast.success("Attributes saved");
            setTimeout(() => {
                setCurrentView("add3");
            }, 2000);
           
        } catch (error) {
            console.error("Error updating product data:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                    Dashboard &gt; <span className="text-indigo-600">Add Product Details</span>
                </h1>
            </header>

            <section className="p-6">
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add Product Attributes</h2>
                    {errors.attributes && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                            {errors.attributes}
                        </div>
                    )}
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Color</label>
                            <select
                                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    (formSubmitted && errors.colorid) ? "border-red-500" : ""
                                }`}
                                value={currentAttribute.colorid}
                                onChange={(e) => setCurrentAttribute({ ...currentAttribute, colorid: e.target.value })}
                            >
                                <option value="">Select a color</option>
                                {color.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.color_name}
                                    </option>
                                ))}
                            </select>
                            {formSubmitted && errors.colorid && (
                                <span className="text-red-500 text-sm mt-1">{errors.colorid}</span>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Size</label>
                            <select
                                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    (formSubmitted && errors.sizeid) ? "border-red-500" : ""
                                }`}
                                value={currentAttribute.sizeid}
                                onChange={(e) => setCurrentAttribute({ ...currentAttribute, sizeid: e.target.value })}
                            >
                                <option value="">Select a size</option>
                                {size.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.size_name}
                                    </option>
                                ))}
                            </select>
                            {formSubmitted && errors.sizeid && (
                                <span className="text-red-500 text-sm mt-1">{errors.sizeid}</span>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Original Price</label>
                            <input
                                type="number"
                                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    (formSubmitted && errors.price) ? "border-red-500" : ""
                                }`}
                                placeholder="Enter original price"
                                value={currentAttribute.price}
                                onChange={(e) => setCurrentAttribute({ ...currentAttribute, price: e.target.value })}
                                min="0"
                                step="0.01"
                            />
                            {formSubmitted && errors.price && (
                                <span className="text-red-500 text-sm mt-1">{errors.price}</span>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Stock</label>
                            <input
                                type="number"
                                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    (formSubmitted && errors.stock) ? "border-red-500" : ""
                                }`}
                                placeholder="Enter stock quantity"
                                value={currentAttribute.stock}
                                onChange={(e) => setCurrentAttribute({ ...currentAttribute, stock: e.target.value })}
                                min="0"
                            />
                            {formSubmitted && errors.stock && (
                                <span className="text-red-500 text-sm mt-1">{errors.stock}</span>
                            )}
                        </div>
                    </form>

                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={handleAddAttribute}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mr-2"
                        >
                            Add Attribute
                        </button>
                    </div>

                    {attributes.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-3">Added Attributes</h3>
                            <table className="min-w-full bg-white border">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border">Color</th>
                                        <th className="px-4 py-2 border">Size</th>
                                        <th className="px-4 py-2 border">Price</th>
                                        <th className="px-4 py-2 border">Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attributes.map((attr, index) => {
                                        const colorName = color.find(
                                            (c) => Number(c.id) === Number(attr.colorid)
                                        )?.color_name;
                                        const sizeName = size.find((s) => Number(s.id) === Number(attr.sizeid))?.size_name;
                                        return (
                                            <tr key={index}>
                                                <td className="px-4 py-2 border">{colorName}</td>
                                                <td className="px-4 py-2 border">{sizeName}</td>
                                                <td className="px-4 py-2 border">{attr.price}</td>
                                                <td className="px-4 py-2 border">{attr.stock}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={handleAddProduct2}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Continue &gt;
                        </button>
                    </div>
                </div>
            </section>
             <ToastContainer />
        </div>
    );
};

export default AddProducts2;