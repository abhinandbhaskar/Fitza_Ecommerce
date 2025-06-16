import React, { useState, useEffect } from "react";
import Header from "../../../components/User/Header/Header";
import Footer from "../../../components/User/Footer/Footer";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { safe } from "../../../utils/safeAccess";

const CategoryProducts = () => {
    const { pro_name } = useParams();
    const { accessToken } = useSelector((state) => state.auth);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [highestprice, sethighestPrice] = useState(0);
    const [priceRange, setPriceRange] = useState([0, highestprice]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedGender, setSelectedGender] = useState("");
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [sortOption, setSortOption] = useState("featured");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        price: true,
        size: true,
        color: true,
        brand: true,
    });

    const navigate = useNavigate();

    // Extract filter options from products data
    const extractFilterOptions = () => {
        const sizes = new Set();
        const colors = new Set();
        const categories = new Set();
        const brands = new Set();

        products.forEach((product) => {
            // Extract sizes
            product.items?.forEach((item) => {
                if (item.size?.size_name) {
                    sizes.add(item.size.size_name);
                }

                // Extract colors
                if (item.color?.color_name) {
                    colors.add(item.color.color_name);
                }
            });

            // Extract categories
            if (product.category?.category_name) {
                categories.add(product.category.category_name);
            }

            // Extract brands
            if (product.brand?.brand_name) {
                brands.add(product.brand.brand_name);
            }
        });

        return {
            sizes: Array.from(sizes).sort(),
            colors: Array.from(colors).sort(),
            categories: Array.from(categories).sort(),
            brands: Array.from(brands).sort(),
        };
    };

    const { sizes, colors, categories, brands } = extractFilterOptions();

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`https://127.0.0.1:8000/api/fetch_cate_products/${pro_name}/`, {});

            setProducts(safe(response,'data'));
            setFilteredProducts(safe(response,'data'));
            console.log("Products data:", response.data);

            if (response.data.length > 0) {
                const maxPrice = response.data.reduce((max, product) => {
                    const itemPrice = parseFloat(product.items[0]?.sale_price || 0);
                    return itemPrice > max ? itemPrice : max;
                }, 0);
                sethighestPrice(maxPrice);
                setPriceRange([0, maxPrice]); // Reset price range to full range
            }

            if (response.data.length === 0) {
                setError("No products found matching your search.");
            }
        } catch (errors) {
            console.error(errors);
            setError("Failed to fetch products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const AddToCart = (id) => {
        if(!accessToken || accessToken.length === 0) {
            toast.error("You need to login first!");
            return;
        }
        navigate(`/productview/${id}`);
    };

    const AddToWishlist = async (id) => {
            if(!accessToken || accessToken.length === 0) {
                toast.error("You need to login first!");
                return;
            }
        try {
            const response = await axios.post(
                `https://127.0.0.1:8000/api/add_wishlist/${id}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    withCredentials: true,
                }
            );
            console.log(response);
            console.log("Wishlist Res", response.data);
            toast.success(" Product added to wishlist!");
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
            toast.error("Error while add product to wishlist..");
        }
    };

    const toggleSizeSelection = (size) => {
        setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
    };

    const toggleColorSelection = (color) => {
        setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]));
    };

    const toggleBrandSelection = (brand) => {
        setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]));
    };

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const clearAllFilters = () => {
        setSelectedSizes([]);
        setSelectedColors([]);
        setSelectedBrands([]);
        setSelectedCategory("");
        setSelectedGender("");
        setPriceRange([0, highestprice]);
        setSortOption("featured");
        setFilteredProducts(products);
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortOption(value);
        sortProducts(value);
    };

    const sortProducts = (option) => {
        let sorted = [...filteredProducts];

        switch (option) {
            case "price-low-high":
                sorted.sort((a, b) => parseFloat(a.items[0]?.sale_price || 0) - parseFloat(b.items[0]?.sale_price || 0));
                break;
            case "price-high-low":
                sorted.sort((a, b) => parseFloat(b.items[0]?.sale_price || 0) - parseFloat(a.items[0]?.sale_price || 0));
                break;
            case "featured":
            default:
                // Default sorting (perhaps by ID or keep original order)
                sorted = [...products];
                break;
        }

        setFilteredProducts(sorted);
    };

    // Apply filters whenever filter criteria change
    useEffect(() => {
        if (products.length === 0) return;

        let result = [...products];

        // Filter by price range

        result = result.filter((product) => {
            const itemPrice = parseFloat(product.items[0]?.sale_price || 0);
            console.log("PRA", itemPrice);
            return itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
        });

        // Filter by size
        if (selectedSizes.length > 0) {
            result = result.filter((product) => product.items.some((item) => selectedSizes.includes(item.size?.size_name)));
        }

        // Filter by color
        if (selectedColors.length > 0) {
            result = result.filter((product) =>
                product.items.some((item) => selectedColors.includes(item.color?.color_name))
            );
        }

        // Filter by brand
        if (selectedBrands.length > 0) {
            result = result.filter((product) => selectedBrands.includes(product.brand?.brand_name));
        }

        // Filter by category
        if (selectedCategory) {
            result = result.filter((product) => product.category?.category_name === selectedCategory);
        }

        // Apply sorting
        sortProducts(sortOption);

        setFilteredProducts(result);
    }, [products, priceRange, selectedSizes, selectedColors, selectedBrands, selectedCategory, selectedGender, sortOption]);

    useEffect(() => {
        fetchProducts();
    }, [pro_name]);

    // ... (keep the loading and error states the same)

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Page header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Search Results for "{pro_name}"
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"} found
                            </p>
                        </div>
                        <button
                            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                            className="md:hidden flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg mt-4 md:mt-0"
                        >
                            <i className="fa-solid fa-filter p-1 text-white"></i> Filters
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Filter sidebar - desktop */}
                        <div
                            className={`hidden md:block w-full md:w-80 flex-shrink-0 ${
                                mobileFiltersOpen ? "block" : "hidden"
                            }`}
                        >
                            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
                                    <button onClick={clearAllFilters} className="text-sm text-blue-600 hover:text-blue-800">
                                        Clear all
                                    </button>
                                </div>

                                {/* Brand filter */}
                                {brands.length > 0 && (
                                    <div className="mb-6">
                                        <div
                                            className="flex justify-between items-center cursor-pointer mb-3"
                                            onClick={() => toggleSection("brand")}
                                        >
                                            <h3 className="font-medium text-gray-700">Brand</h3>
                                            <i
                                                className={`fa-solid ${
                                                    expandedSections.brand ? "fa-chevron-up" : "fa-chevron-down"
                                                }`}
                                            ></i>
                                        </div>
                                        {expandedSections.brand && (
                                            <div className="space-y-2">
                                                {brands.map((brand) => (
                                                    <div key={brand} className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id={`brand-${brand}`}
                                                            checked={selectedBrands.includes(brand)}
                                                            onChange={() => toggleBrandSelection(brand)}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <label htmlFor={`brand-${brand}`} className="ml-3 text-gray-700">
                                                            {brand}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Category filter */}
                                {categories.length > 0 && (
                                    <div className="mb-6">
                                        <div
                                            className="flex justify-between items-center cursor-pointer mb-3"
                                            onClick={() => toggleSection("category")}
                                        >
                                            <h3 className="font-medium text-gray-700">Category</h3>
                                            <i
                                                className={`fa-solid ${
                                                    expandedSections.category ? "fa-chevron-up" : "fa-chevron-down"
                                                }`}
                                            ></i>
                                        </div>
                                        {expandedSections.category && (
                                            <div className="space-y-2">
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        id="category-all"
                                                        name="category"
                                                        checked={selectedCategory === ""}
                                                        onChange={() => setSelectedCategory("")}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="category-all" className="ml-3 text-gray-700">
                                                        All Categories
                                                    </label>
                                                </div>
                                                {categories.map((category) => (
                                                    <div key={category} className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            id={`category-${category}`}
                                                            name="category"
                                                            checked={selectedCategory === category}
                                                            onChange={() => setSelectedCategory(category)}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <label
                                                            htmlFor={`category-${category}`}
                                                            className="ml-3 text-gray-700"
                                                        >
                                                            {category}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Price filter */}
                                <div className="mb-6">
                                    <div
                                        className="flex justify-between items-center cursor-pointer mb-3"
                                        onClick={() => toggleSection("price")}
                                    >
                                        <h3 className="font-medium text-gray-700">Price Range</h3>
                                        <i
                                            className={`fa-solid ${
                                                expandedSections.price ? "fa-chevron-up" : "fa-chevron-down"
                                            }`}
                                        ></i>
                                    </div>
                                    {expandedSections.price && (
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-600">₹{priceRange[0]}</span>
                                                <span className="text-gray-600">₹{priceRange[1]}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max={`${highestprice}`}
                                                value={priceRange[1]}
                                                onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Size filter */}
                                {sizes.length > 0 && (
                                    <div className="mb-6">
                                        <div
                                            className="flex justify-between items-center cursor-pointer mb-3"
                                            onClick={() => toggleSection("size")}
                                        >
                                            <h3 className="font-medium text-gray-700">Size</h3>
                                            <i
                                                className={`fa-solid ${
                                                    expandedSections.size ? "fa-chevron-up" : "fa-chevron-down"
                                                }`}
                                            ></i>
                                        </div>
                                        {expandedSections.size && (
                                            <div className="grid grid-cols-3 gap-2">
                                                {sizes.map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => toggleSizeSelection(size)}
                                                        className={`py-2 border rounded-md text-center text-sm ${
                                                            selectedSizes.includes(size)
                                                                ? "bg-blue-600 text-white border-blue-600"
                                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Color filter */}
                                {colors.length > 0 && (
                                    <div className="mb-6">
                                        <div
                                            className="flex justify-between items-center cursor-pointer mb-3"
                                            onClick={() => toggleSection("color")}
                                        >
                                            <h3 className="font-medium text-gray-700">Color</h3>
                                            <i
                                                className={`fa-solid ${
                                                    expandedSections.color ? "fa-chevron-up" : "fa-chevron-down"
                                                }`}
                                            ></i>
                                        </div>

                                        {expandedSections.color && (
                                            <div className="grid grid-cols-4 gap-3">
                                                {colors.map((color) => {
                                                    // Find a product with this color to get the color code
                                                    const colorProduct = products.find((p) =>
                                                        p.items.some((i) => i.color?.color_name === color)
                                                    );
                                                    const colorItem = colorProduct?.items.find(
                                                        (i) => i.color?.color_name === color
                                                    );

                                                    // Default to gray if no color code found
                                                    let colorStyle = {};
                                                    if (colorItem?.color?.color_code) {
                                                        // If color_code is a hex value
                                                        if (colorItem.color.color_code.startsWith("#")) {
                                                            colorStyle = { backgroundColor: colorItem.color.color_code };
                                                        }
                                                        // If color_code is a Tailwind class name (e.g., "bg-red-500")
                                                        else if (colorItem.color.color_code.startsWith("bg-")) {
                                                            // Use the Tailwind class directly
                                                            colorStyle = {}; // We'll use className for Tailwind classes
                                                        }
                                                    }

                                                    // Common color mappings (extend this as needed)
                                                    const colorClassMap = {
                                                        Red: "bg-red-500",
                                                        Blue: "bg-blue-500",
                                                        Green: "bg-green-500",
                                                        Yellow: "bg-yellow-400",
                                                        Black: "bg-gray-900",
                                                        White: "bg-white border border-gray-300",
                                                        Pink: "bg-pink-400",
                                                        Purple: "bg-purple-500",
                                                        Orange: "bg-orange-400",
                                                        Gray: "bg-gray-400",
                                                        // Add more mappings as needed
                                                    };

                                                    // Determine the class or style to use
                                                    const colorName = color.toLowerCase();
                                                    let colorClass = colorClassMap[color] || "bg-gray-200";

                                                    // If we have a Tailwind class from the API, use that instead
                                                    if (colorItem?.color?.color_code?.startsWith("bg-")) {
                                                        colorClass = colorItem.color.color_code;
                                                    }

                                                    return (
                                                        <button
                                                            key={color}
                                                            onClick={() => toggleColorSelection(color)}
                                                            className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center ${
                                                                selectedColors.includes(color)
                                                                    ? "ring-2 ring-offset-2 ring-blue-500"
                                                                    : "hover:ring-1 hover:ring-gray-300"
                                                            }`}
                                                            style={colorStyle}
                                                            title={color}
                                                        >
                                                            {selectedColors.includes(color) && (
                                                                <i className="fa-solid fa-times text-white text-xs"></i>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile filter overlay */}
                        {mobileFiltersOpen && (
                            <div className="fixed inset-0 z-50 overflow-y-auto md:hidden">
                                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                    <div
                                        className="fixed inset-0 transition-opacity"
                                        onClick={() => setMobileFiltersOpen(false)}
                                    >
                                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                    </div>
                                    <div className="inline-block align-bottom bg-white rounded-t-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900">Filters</h3>
                                                <button
                                                    onClick={() => setMobileFiltersOpen(false)}
                                                    className="text-gray-400 hover:text-gray-500"
                                                >
                                                    <i className="fa-solid fa-times"></i>
                                                </button>
                                            </div>
                                            <div className="overflow-y-auto max-h-96">
                                                {/* Brand filter */}
                                                {brands.length > 0 && (
                                                    <div className="mb-6">
                                                        <div
                                                            className="flex justify-between items-center cursor-pointer mb-3"
                                                            onClick={() => toggleSection("brand")}
                                                        >
                                                            <h3 className="font-medium text-gray-700">Brand</h3>
                                                            <i
                                                                className={`fa-solid ${
                                                                    expandedSections.brand
                                                                        ? "fa-chevron-up"
                                                                        : "fa-chevron-down"
                                                                }`}
                                                            ></i>
                                                        </div>
                                                        {expandedSections.brand && (
                                                            <div className="space-y-2">
                                                                {brands.map((brand) => (
                                                                    <div key={brand} className="flex items-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            id={`m-brand-${brand}`}
                                                                            checked={selectedBrands.includes(brand)}
                                                                            onChange={() => toggleBrandSelection(brand)}
                                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                                        />
                                                                        <label
                                                                            htmlFor={`m-brand-${brand}`}
                                                                            className="ml-3 text-gray-700"
                                                                        >
                                                                            {brand}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Category filter */}
                                                {categories.length > 0 && (
                                                    <div className="mb-6">
                                                        <div
                                                            className="flex justify-between items-center cursor-pointer mb-3"
                                                            onClick={() => toggleSection("category")}
                                                        >
                                                            <h3 className="font-medium text-gray-700">Category</h3>
                                                            <i
                                                                className={`fa-solid ${
                                                                    expandedSections.category
                                                                        ? "fa-chevron-up"
                                                                        : "fa-chevron-down"
                                                                }`}
                                                            ></i>
                                                        </div>
                                                        {expandedSections.category && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        id="m-category-all"
                                                                        name="m-category"
                                                                        checked={selectedCategory === ""}
                                                                        onChange={() => setSelectedCategory("")}
                                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                                    />
                                                                    <label
                                                                        htmlFor="m-category-all"
                                                                        className="ml-3 text-gray-700"
                                                                    >
                                                                        All Categories
                                                                    </label>
                                                                </div>
                                                                {categories.map((category) => (
                                                                    <div key={category} className="flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            id={`m-category-${category}`}
                                                                            name="m-category"
                                                                            checked={selectedCategory === category}
                                                                            onChange={() => setSelectedCategory(category)}
                                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                                        />
                                                                        <label
                                                                            htmlFor={`m-category-${category}`}
                                                                            className="ml-3 text-gray-700"
                                                                        >
                                                                            {category}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Price filter */}
                                                <div className="mb-6">
                                                    <div
                                                        className="flex justify-between items-center cursor-pointer mb-3"
                                                        onClick={() => toggleSection("price")}
                                                    >
                                                        <h3 className="font-medium text-gray-700">Price Range</h3>
                                                        <i
                                                            className={`fa-solid ${
                                                                expandedSections.price ? "fa-chevron-up" : "fa-chevron-down"
                                                            }`}
                                                        ></i>
                                                    </div>
                                                    {expandedSections.price && (
                                                        <div>
                                                            <div className="flex justify-between mb-2">
                                                                <span className="text-gray-600">${priceRange[0]}</span>
                                                                <span className="text-gray-600">${priceRange[1]}</span>
                                                            </div>
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="200"
                                                                value={priceRange[1]}
                                                                onChange={(e) =>
                                                                    setPriceRange([priceRange[0], e.target.value])
                                                                }
                                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Size filter */}
                                                {sizes.length > 0 && (
                                                    <div className="mb-6">
                                                        <div
                                                            className="flex justify-between items-center cursor-pointer mb-3"
                                                            onClick={() => toggleSection("size")}
                                                        >
                                                            <h3 className="font-medium text-gray-700">Size</h3>
                                                            <i
                                                                className={`fa-solid ${
                                                                    expandedSections.size
                                                                        ? "fa-chevron-up"
                                                                        : "fa-chevron-down"
                                                                }`}
                                                            ></i>
                                                        </div>
                                                        {expandedSections.size && (
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {sizes.map((size) => (
                                                                    <button
                                                                        key={size}
                                                                        onClick={() => toggleSizeSelection(size)}
                                                                        className={`py-2 border rounded-md text-center text-sm ${
                                                                            selectedSizes.includes(size)
                                                                                ? "bg-blue-600 text-white border-blue-600"
                                                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                                        }`}
                                                                    >
                                                                        {size}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Color filter */}
                                                {colors.length > 0 && (
                                                    <div className="mb-6">
                                                        <div
                                                            className="flex justify-between items-center cursor-pointer mb-3"
                                                            onClick={() => toggleSection("color")}
                                                        >
                                                            <h3 className="font-medium text-gray-700">Color</h3>
                                                            <i
                                                                className={`fa-solid ${
                                                                    expandedSections.color
                                                                        ? "fa-chevron-up"
                                                                        : "fa-chevron-down"
                                                                }`}
                                                            ></i>
                                                        </div>
                                                        {expandedSections.color && (
                                                            <div className="grid grid-cols-4 gap-3">
                                                                {colors.map((color) => {
                                                                    const colorProduct = products.find((p) =>
                                                                        p.items.some((i) => i.color?.color_name === color)
                                                                    );
                                                                    const colorItem = colorProduct?.items.find(
                                                                        (i) => i.color?.color_name === color
                                                                    );
                                                                    const colorCode =
                                                                        colorItem?.color?.color_code || "bg-gray-200";

                                                                    return (
                                                                        <button
                                                                            key={color}
                                                                            onClick={() => toggleColorSelection(color)}
                                                                            className={`w-8 h-8 rounded-full ${colorCode} flex items-center justify-center ${
                                                                                selectedColors.includes(color)
                                                                                    ? "ring-2 ring-offset-2 ring-blue-500"
                                                                                    : "hover:ring-1 hover:ring-gray-300"
                                                                            }`}
                                                                            title={color}
                                                                        >
                                                                            {selectedColors.includes(color) && (
                                                                                <i className="fa-solid fa-times text-white text-xs"></i>
                                                                            )}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                            <button
                                                type="button"
                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                onClick={() => setMobileFiltersOpen(false)}
                                            >
                                                Apply Filters
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                                onClick={clearAllFilters}
                                            >
                                                Clear All
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Product grid */}
                        <div className="flex-1">
                            {/* Sorting options */}
                            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    Showing {filteredProducts.length} of {products.length} products
                                </div>
                                {/* <div className="flex items-center">
                                    <label htmlFor="sort" className="mr-2 text-sm text-gray-600">
                                        Sort by:
                                    </label>
                                    <select
                                        id="sort"
                                        value={sortOption}
                                        onChange={handleSortChange}
                                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="price-low-high">Price: Low to High</option>
                                        <option value="price-high-low">Price: High to Low</option>
                                    </select>
                                </div> */}
                            </div>

                            {/* Products */}
                            {filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-1 ">
                                    {filteredProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="p-4 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
                                        >
                                            <div className="relative mb-4">
                                                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                                                    New
                                                </div>
                                                <img
                                                    src={
                                                        product.items?.[0]?.images?.[0]?.main_image
                                                            ? `https://127.0.0.1:8000${product.items[0].images[0].main_image}`
                                                            : "/path/to/default/image.jpg"
                                                    }
                                                    alt={product.product_name}
                                                    className="w-full h-78 object-cover rounded-md"
                                                />
                                                <div className="absolute top-2 right-2 flex gap-2">
                                                    <div
                                                        onClick={() => AddToCart(product.id)}
                                                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer"
                                                        title="Add to Cart"
                                                    >
                                                        <i className="fa-solid fa-cart-arrow-down text-gray-700"></i>
                                                    </div>
                                                    <div
                                                        onClick={() => AddToWishlist(product.id)}
                                                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer"
                                                        title="Add to Wishlist"
                                                    >
                                                        <i className="fa-regular fa-heart text-gray-700"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-800">{product.product_name}</h2>
                                                <p className="text-sm text-gray-600">
                                                    {product.product_description.length > 28
                                                        ? `${product.product_description.substring(0, 28)}...`
                                                        : product.product_description}
                                                </p>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between">
                                                <div>
                                                    {product?.offers?.[0]?.discount_percentage > 0 ? (
                                                        <>
                                                            <span className="text-sm text-gray-400 line-through mr-2">
                                                                ${product.items[0].sale_price}
                                                            </span>
                                                            <span className="text-lg font-bold text-green-600">
                                                                $
                                                                {(
                                                                    parseFloat(product.items[0].sale_price) *
                                                                    (1 -
                                                                        parseFloat(product.offers[0].discount_percentage) /
                                                                            100)
                                                                ).toFixed(2)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-lg font-bold text-gray-800">
                                                            ${product.items[0].sale_price}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-yellow-500 font-medium">
                                                        {product.ratings.average_rating.toFixed(1)}
                                                    </span>
                                                    <span className="text-yellow-400 ml-1">★</span>
                                                    <span className="text-gray-500 text-sm ml-2">
                                                        ({product.ratings.total_reviews} reviews)
                                                    </span>
                                                </div>
                                            </div>
                                            {product?.offers?.[0]?.discount_percentage > 0 && (
                                                <div className="mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-medium">
                                                    {product.offers[0].discount_percentage}% OFF
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                                        No products match your filters
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Try adjusting your filters or search for something else
                                    </p>
                                    <button
                                        onClick={clearAllFilters}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <ToastContainer /> 
            </div>
            <Footer />
        </>
    );
};

export default CategoryProducts;
