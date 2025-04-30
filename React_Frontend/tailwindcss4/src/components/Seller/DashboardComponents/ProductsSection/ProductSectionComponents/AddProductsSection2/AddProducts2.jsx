import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProducts, addProductAttribute } from "../../../../../../redux/ProductsSlice";

const AddProducts2 = ({ setCurrentView }) => {
    const { products, description, cateid, brandid, modelheight, modelwearing, instruction, about, attributes } =
        useSelector((state) => state.product?.product || {});

    const { accessToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [color, setColor] = useState([]);
    const [size, setSize] = useState([]);

    console.log("COLLL", color);
    console.log("SIze", size);

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

    const handleAddAttribute = () => {
        if (currentAttribute.colorid && currentAttribute.sizeid && currentAttribute.price && currentAttribute.stock) {
            dispatch(addProductAttribute(currentAttribute));
            setCurrentAttribute({ colorid: "", sizeid: "", price: "", stock: "" });
        }
    };

    const handleAddProduct2 = async () => {
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
                })
            );
            console.log("Product data updated successfully");
        } catch (error) {
            console.error("Error updating product data:", error);
        }
        setCurrentView("add3");
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
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Color</label>
                            <select
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={currentAttribute.colorid}
                                onChange={(e) => setCurrentAttribute({ ...currentAttribute, colorid: e.target.value })}
                            >
                                <option>Select a color</option>
                                {color.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.color_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Size</label>
                            <select
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={currentAttribute.sizeid}
                                onChange={(e) => setCurrentAttribute({ ...currentAttribute, sizeid: e.target.value })}
                            >
                                <option>Select a size</option>
                                {size.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.size_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Original Price</label>
                            <input
                                type="number"
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter original price"
                                value={currentAttribute.price}
                                onChange={(e) => setCurrentAttribute({ ...currentAttribute, price: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Stock</label>
                            <input
                                type="number"
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter stock quantity"
                                value={currentAttribute.stock}
                                onChange={(e) => setCurrentAttribute({ ...currentAttribute, stock: e.target.value })}
                            />
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
        </div>
    );
};

export default AddProducts2;
