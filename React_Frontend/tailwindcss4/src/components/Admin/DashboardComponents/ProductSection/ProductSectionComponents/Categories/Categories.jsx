import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
    const [viewSubCategory,setViewSubCategory]=useState([]);

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
            const response = await axios.post("https://127.0.0.1:8000/api/admin/add_sub_category/",formData,{
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
            console.log(errors);
            console.log(errors.response.data);
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


    const ViewSubCategorys=async()=>{
        setView("viewsub");

                try {
            const response = await axios.get("https://127.0.0.1:8000/api/admin/view_sub_category/", {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log("ooooooooooooo", response.data);
            setViewSubCategory(response.data);
            // setViewCategory(response.data);

            // const categoryNames = response.data.map((item) => item.category_name); // Extract category names
            // setCategories(categoryNames); // Update the state with only category names
            // console.log("asasaasaasasasasassass", categoryNames);
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }


    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    <span className="text-indigo-600">Categories</span> Management
                </h1>
            </div>

            {/* Buttons for View/Add Categories */}
            <div className="flex justify-center my-4 space-x-4">
                <button
                    onClick={() => ViewCategorys()}
                    className={`px-4 py-2 text-white font-medium rounded-lg shadow ${
                        view === "view" ? "bg-indigo-600" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                    View Main Categories
                </button>
                  <button
                    onClick={() => ViewSubCategorys()}
                    className={`px-4 py-2 text-white font-medium rounded-lg shadow ${
                        view === "viewsub" ? "bg-indigo-600" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                    View SubCategories
                </button>
                <button
                    onClick={() => setView("add")}
                    className={`px-4 py-2 text-white font-medium rounded-lg shadow ${
                        view === "add" ? "bg-indigo-600" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                    Add Categories
                </button>

                <button
                    onClick={() => handleAddSubCategory()}
                    className={`px-4 py-2 text-white font-medium rounded-lg shadow ${
                        view === "add" ? "bg-indigo-600" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                    Add SubCategories
                </button>
            </div>

            {/* View Categories Section */}
            {view === "view" && (
                <div className="w-full max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Category List</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-600">
                                    <th className="border border-gray-200 px-4 py-2">ID</th>
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
                                        <td className="border border-gray-200 px-4 py-2">#{category.id}</td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            <img
                                                src={"https://127.0.0.1:8000" + category.category_image}
                                                alt="category"
                                                className="h-16 w-16 object-cover rounded-full"
                                            />
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">{category.category_name}</td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            {category.category_description}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            <button
                                                onClick={() => updateCategory(category.id)}
                                                className="px-3 py-1 text-white bg-yellow-500 rounded-lg shadow hover:bg-yellow-600"
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
                                <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-600">
                                    <th className="border border-gray-200 px-4 py-2">ID</th>
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
                                        <td className="border border-gray-200 px-4 py-2">#{category.id}</td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            {category.category.category_name}
                                            
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">{category.subcategory_name}</td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            {category.subcategory_description}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            <button
                                                onClick={() => updateCategory(category.id)}
                                                className="px-3 py-1 text-white bg-yellow-500 rounded-lg shadow hover:bg-yellow-600"
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
                                            setImage(file); // Set the selected file for submission
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
                                            image instanceof File
                                                ? URL.createObjectURL(image) // Preview the selected file temporarily
                                                : image // Show existing profile photo URL
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
                            onClick={AddCategory}
                            type="button"
                            className="px-6 py-2 text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700"
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
        </div>
    );
};

export default Categories;
