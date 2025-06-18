import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { safe } from "../../../../../../utils/safeAccess";

const Categories = () => {
    const { accessToken } = useSelector((state) => state.auth);
    const [view, setView] = useState("view");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [viewcategory, setViewCategory] = useState([]);

    const [category1, setCategory1] = useState("");
    const [description1, setDescription1] = useState("");
    const [image1, setImage1] = useState("");
    const [cate_id, setCateId] = useState("");

    const [parentCategory, setParentCategory] = useState("");
    const [subcategoryName, setSubcategoryName] = useState("");
    const [categories, setCategories] = useState([]);
    const [subdescription, setsubDescription] = useState("");
    const [viewSubCategory, setViewSubCategory] = useState([]);
    const [subcategory1, setsubcategory1] = useState("");
    const [subdescription1, setSubdescription1] = useState("");
    const [parentCategory1, setParentCategory1] = useState("");

    const handleAddSubCategory = () => {
        setView("addsub");
        fetchCategory();
    };

    const AddCategory = async (e) => {
        e.preventDefault();
        const addData = {
            category: category,
            description: description,
            image: image,
        };
        console.log(addData);
        console.log(accessToken);

        try {
            const response = await axios.post("https://127.0.0.1:8000/api/admin/add_category/", addData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.status === 201) {
                alert(response.data.message);
            }
        } catch (errors) {
            alert(errors.response.data.errors.non_field_errors);
        }
    };

    const AddSubcategory = async () => {
        const formData = new FormData();
        formData.append("category", parentCategory);
        formData.append("subcategoryName", subcategoryName);
        formData.append("subdescription", subdescription);

        try {
            const response = await axios.post("https://127.0.0.1:8000/api/admin/add_sub_category/", formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            console.log(response.data);
            if (response.status === 201) {
                alert("Subcategory added successfully!");
                // Clear form or refresh data
                setParentCategory("");
                setSubcategoryName("");
                setsubDescription("");
            } else {
                alert("Failed to add subcategory.");
            }
        } catch (error) {
            console.error("Error adding subcategory:", error);
        }
    };

    const fetchCategory = async (e) => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/admin/view_category/", {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log("asasaasaasasasasassass", response.data);
            setViewCategory(response.data);

            const categoryNames = response.data.map((item) => item.category_name); // Extract category names
            setCategories(categoryNames); // Update the state with only category names
            console.log("asasaasaasasasasassass", categoryNames);
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const fetchUpdateCategory = async (cate_id) => {
        try {
            const response = await axios.get(`https://127.0.0.1:8000/api/admin/fetch_update_category/${cate_id}/`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response.data);
            console.log("FET", response.data[0]);
            setCategory1(response.data[0].category_name);
            setDescription1(response.data[0].category_description);
            setImage1(response.data[0].category_image);
            setCateId(response.data[0].id);
        } catch (errors) {
            console.log("r", errors);
            console.log("b", errors.response.data);
        } finally {
            console.log("Com");
        }
    };

    const updateCategory = (cate_id) => {
        setView("update");
        console.log(cate_id);
        fetchUpdateCategory(cate_id);
    };

    const updateNewCategory = async (cate_id) => {
        console.log(cate_id);
        const formData = new FormData();
        formData.append("cate_id", cate_id);
        formData.append("category", category1);
        formData.append("description", description1);
        formData.append("image", image1);

        formData.forEach((value, key) => {
            console.log(value, key);
        });

        try {
            const response = await axios.put(`https://127.0.0.1:8000/api/admin/update_new_category/${cate_id}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response.data);
            if (response.status === 200) {
                alert(response.data.message);
            } else {
                setError("Failed to update profile. Please try again.");
            }
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
            alert("Add Image");
        }
    };

    const ViewCategorys = () => {
        setView("view");
        fetchCategory();
    };

    const handleCategoryDelete = async (cate_id) => {
        console.log(cate_id);

        try {
            const response = await axios.delete(`https://127.0.0.1:8000/api/admin/delete_category/${cate_id}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response.data);
            if (response.status === 200) {
                alert(response.data.message);
                fetchCategory();
            }
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    const handleSubCategoryDelete = async (cate_id) => {
        console.log(cate_id);

        try {
            const response = await axios.delete(`https://127.0.0.1:8000/api/admin/delete_sub_category/${cate_id}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response.data);
            if (response.status === 200) {
                alert(response.data.message);
                ViewSubCategorys();
            }
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    const ViewSubCategorys = async () => {
        setView("viewsub");

        try {
            const response = await axios.get("https://127.0.0.1:8000/api/admin/view_sub_category/", {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setViewSubCategory(response.data);
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    const updateSubCategory = async (cate_id) => {
        setView("subupdate");

        try {
            const response = await axios.get(`https://127.0.0.1:8000/api/admin/fetch_subupdate_category/${cate_id}/`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            fetchCategory();
            console.log("OPOPOPPPPPPP", response.data);
            // console.log("FET", response.data[0]);
            setParentCategory1(response.data[0].category.category_name);
            setsubcategory1(response.data[0].subcategory_name);
            setSubdescription1(response.data[0].subcategory_description);
            // setImage1(response.data[0].category_image);
            setCateId(response.data[0].id);
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    const updateNewSubCategory = async (cate_id) => {
        console.log("name", subcategory1);
        console.log("description", subdescription1);
        console.log("KO", cate_id);

        const formData = new FormData();
        formData.append("parentCategory", parentCategory1);
        formData.append("category", subcategory1);
        formData.append("description", subdescription1);

        formData.forEach((value, key) => {
            console.log(value, key);
        });

        try {
            const response = await axios.post(
                `https://127.0.0.1:8000/api/admin/update_newsub_category/${cate_id}/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(response.data);
            if (response.status === 200) {
                alert(response.data.message);
            } else {
                setError("Failed to update profile. Please try again.");
            }
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
            console.log("pp");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    <span className="text-indigo-600">Categories</span> Management
                </h1>
            </div>

            {/* Buttons for View/Add Categories */}
            <div className="flex flex-wrap justify-center gap-4 my-6">
                <button
                    onClick={() => ViewCategorys()}
                    className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        view === "view"
                            ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 10h16M4 14h16M4 18h16"
                            />
                        </svg>
                        Main Categories
                    </div>
                </button>

                <button
                    onClick={() => ViewSubCategorys()}
                    className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        view === "viewsub"
                            ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                        </svg>
                        Subcategories
                    </div>
                </button>

                <button
                    onClick={() => setView("add")}
                    className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        view === "add"
                            ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        Add Category
                    </div>
                </button>

                <button
                    onClick={() => handleAddSubCategory()}
                    className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        view === "addsub"
                            ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        Add Subcategory
                    </div>
                </button>
            </div>

            {/* View Categories Section */}
            {view === "view" && (
                <div className="w-full max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Category List</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-50 text-left text-sm font-semibold text-black">
                                    <th className="border border-gray-200 px-4 py-2">No.</th>
                                    <th className="border border-gray-200 px-4 py-2">Image</th>
                                    <th className="border border-gray-200 px-4 py-2">Category Name</th>
                                    <th className="border border-gray-200 px-4 py-2">Description</th>
                                    <th className="border border-gray-200 px-4 py-2">Update</th>
                                    <th className="border border-gray-200 px-4 py-2">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {viewcategory.map((category, key) => (
                                    <tr value={key} className="hover:bg-gray-100 text-sm text-gray-700">
                                        <td className="border border-gray-200 px-4 py-2">{key + 1}</td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            <img
                                                src={"https://127.0.0.1:8000" + safe(category, "category_image")}
                                                alt="category"
                                                className="h-16 w-16 object-cover rounded-full"
                                            />
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            {safe(category, "category_name")}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            {safe(category, "category_description")}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            <button
                                                onClick={() => updateCategory(category.id)}
                                                className="px-3 py-1 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600"
                                            >
                                                Update
                                            </button>
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            <button
                                                onClick={() => handleCategoryDelete(category.id)}
                                                className="px-3 py-1 text-white bg-red-500 rounded-lg shadow hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {view === "viewsub" && (
                <div className="w-full max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Category List</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-50 text-left text-sm font-semibold text-black">
                                    <th className="border border-gray-200 px-4 py-2">No.</th>
                                    <th className="border border-gray-200 px-4 py-2">Main Category</th>
                                    <th className="border border-gray-200 px-4 py-2">Sub Category</th>
                                    <th className="border border-gray-200 px-4 py-2">Description</th>
                                    <th className="border border-gray-200 px-4 py-2">Update</th>
                                    <th className="border border-gray-200 px-4 py-2">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {viewSubCategory.map((category, key) => (
                                    <tr value={key} className="hover:bg-gray-100 text-sm text-gray-700">
                                        <td className="border border-gray-200 px-4 py-2">{key + 1}</td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            {safe(category, "category.category_name")}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            {safe(category, "subcategory_name")}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            {safe(category, "subcategory_description")}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            <button
                                                onClick={() => updateSubCategory(category.id)}
                                                className="px-3 py-1 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600"
                                            >
                                                Update
                                            </button>
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            <button
                                                onClick={() => handleSubCategoryDelete(category.id)}
                                                className="px-3 py-1 text-white bg-red-500 rounded-lg shadow hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Categories Section */}
            {view === "add" && (
                <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
    <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Category</h2>
    <form className="space-y-4">
        <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-600">
                Category Name
            </label>
            <input
                type="text"
                id="categoryName"
                placeholder="Enter category name"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300"
                name="categoryName"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            />
        </div>
        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-600">
                Description
            </label>
            <textarea
                id="description"
                rows="3"
                placeholder="Enter category description"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            ></textarea>
        </div>
        <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-600 mb-2">
                Image
            </label>
            <div className="relative">
                <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            setImage(file);
                        }
                    }}
                />
                {image ? (
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <img
                                className="h-64 w-64 object-cover rounded-lg border-2 border-gray-200 shadow-md"
                                src={image instanceof File ? URL.createObjectURL(image) : image}
                                alt="Category Preview"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('fileInput').click()}
                                    className="p-2 bg-white rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors"
                                    title="Change image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImage(null)}
                                    className="ml-2 p-2 bg-white rounded-full text-red-600 hover:bg-red-100 transition-colors"
                                    title="Remove image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">Click on the image to change or remove</p>
                    </div>
                ) : (
                    <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-gray-50 transition-all duration-200"
                        onClick={() => document.getElementById('fileInput').click()}
                    >
                        <div className="flex flex-col items-center justify-center">
                            <div className="bg-indigo-100 p-3 rounded-full mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-700">Upload an image</h3>
                            <p className="text-sm text-gray-500 mt-1">Click to browse or drag and drop</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <button
            onClick={AddCategory}
            type="button"
            className="px-6 py-2 text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 transition-colors"
        >
            Submit
        </button>
    </form>
</div>

            )}

            {/* Add Categories Section */}
            {/* Add Subcategories Section */}
            {view === "addsub" && (
                <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Subcategory</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-600">
                                Parent Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={parentCategory}
                                onChange={(e) => setParentCategory(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300"
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="subcategoryName" className="block text-sm font-medium text-gray-600">
                                Subcategory Name
                            </label>
                            <input
                                type="text"
                                id="subcategoryName"
                                placeholder="Enter subcategory name"
                                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300"
                                name="subcategoryName"
                                value={subcategoryName}
                                onChange={(e) => setSubcategoryName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-600">
                                Description
                            </label>
                            <textarea
                                id="description"
                                rows="3"
                                placeholder="Enter subcategory description"
                                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300"
                                name="description"
                                value={subdescription}
                                onChange={(e) => setsubDescription(e.target.value)}
                            ></textarea>
                        </div>
                        <button
                            onClick={() => AddSubcategory()}
                            type="button"
                            className="px-6 py-2 text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            )}

            {view === "update" && (
                <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Update Category</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-600">
                                Category Name
                            </label>
                            <input
                                type="text"
                                id="categoryName"
                                placeholder="Enter category name"
                                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300"
                                value={category1}
                                onChange={(e) => setCategory1(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-600">
                                Description
                            </label>
                            <textarea
                                id="description"
                                rows="3"
                                placeholder="Enter category description"
                                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300"
                                value={description1}
                                onChange={(e) => setDescription1(e.target.value)}
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-600">
                                Image
                            </label>
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
                                    className="bg-gradient-to-r from-gray-500 to-gray-700 flex items-center justify-center w-[120px] m-2 p-1 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                                >
                                    <img
                                        className="h-[60px] w-[60px] rounded-full border-2 border-white"
                                        src={
                                            "https://127.0.0.1:8000" + image1 instanceof File
                                                ? URL.createObjectURL("https://127.0.0.1:8000" + image1) // Preview the selected file temporarily
                                                : "https://127.0.0.1:8000" + image1 // Show existing profile photo URL
                                        }
                                        alt="Profile Picture"
                                    />
                                    <div className="ml-3 flex items-center justify-center bg-white text-amber-700 rounded-full h-[40px] w-[40px] shadow-md hover:bg-amber-300 transition-colors duration-300">
                                        <i class="fa-solid fa-square-plus"></i>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <button
                            onClick={() => updateNewCategory(cate_id)}
                            type="button"
                            className="px-6 py-2 text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700"
                        >
                            Update
                        </button>
                    </form>
                </div>
            )}

            {view === "subupdate" && (
                <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Update Category</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-600">
                                Parent Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={parentCategory1}
                                onChange={(e) => setParentCategory1(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300"
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-600">
                                Sub Category Name
                            </label>
                            <input
                                type="text"
                                id="categoryName"
                                placeholder="Enter category name"
                                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300"
                                value={subcategory1}
                                onChange={(e) => setsubcategory1(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-600">
                                Description
                            </label>
                            <textarea
                                id="description"
                                rows="3"
                                placeholder="Enter category description"
                                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-indigo-300"
                                value={subdescription1}
                                onChange={(e) => setSubdescription1(e.target.value)}
                            ></textarea>
                        </div>
                        <button
                            onClick={() => updateNewSubCategory(cate_id)}
                            type="button"
                            className="px-6 py-2 text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700"
                        >
                            Update
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Categories;
