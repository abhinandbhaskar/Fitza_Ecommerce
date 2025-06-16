import React, { useEffect, useState } from "react";
import "./Header.css";
import Logo from "../../../assets/Logo/Fitza_logo.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { safe } from "../../../utils/safeAccess";

const Header = ({countsN,setNcounts}) => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const { isAuthenticated, accessToken } = useSelector((state) => state.auth);
    const [cate1, setCate1] = useState([]);
    const [subcate, setSubCate] = useState([]);
    const [search,setSearch]=useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(3); // Mock count
    
    const navigate = useNavigate();

    const dropdownOptions = {
        "Men's Wear": cate1,
        "Women's Wear": cate1,
        "Kid's Wear": cate1,
    };

    const handleMouseEnter = (dropdown) => setActiveDropdown(dropdown);
    const handleMouseLeave = () => setActiveDropdown(null);

    const fetchDropDownData = async (cate_status) => {
        try {
            const response = await axios.get(
                `https://127.0.0.1:8000/api/drop_down_category/${cate_status}/`,{});
            const categoryDescriptions = response.data.map(
                (item) => safe(item,'category_description')
            );
            setCate1(categoryDescriptions);
        } catch (error) {
            console.error("Category Fetch Error:", error);
        }
    };

    const getAllProducts = async () => {
        try {
            const response = await axios.get(
                "https://127.0.0.1:8000/api/fetch_drop_data/",{});
            setSubCate(response.data);
            setProducts(response.data);
        } catch (error) {
            console.error("Sub-category Fetch Error:", error);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearch(query);
        const filtered = products.filter((product) =>
            product.product_name.toLowerCase().includes(query)
        );
        setFilteredProducts(filtered);
    };

    const ViewProduct = async (pro_name) => {
        navigate(`/categoryproduct/${pro_name}`);
    };

    const handleSellerJoin = () => {
        navigate(isAuthenticated ? "/seller/landpage" : "/seller/landpage");
    };

    
        const fetchNotificationCount=async()=>{

                try {
                    const response = await axios.get("https://127.0.0.1:8000/api/user_unread_notifications/", {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    console.log("KAKAKAKAK", response);
                    setNcounts(response.data.notifications);
                    // setCountN(response.data.notifications)
                   
                } catch (errors) {
                    console.log("errors:", errors);
                    console.log("errors:", errors.response.data);
                }

    }




    useEffect(() => {
        getAllProducts();
        fetchNotificationCount();
    }, []);

    useEffect(() => {
        if (activeDropdown) {
            fetchDropDownData(activeDropdown);
        }
    }, [activeDropdown]);

    return (
        <header className="w-full relative">
            {/* Top Bar */}
            <div className="header-top bg-red-300 h-8 w-full flex items-center justify-between px-4">
                <div className="flex space-x-2">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-square-facebook p-2 text-white text-sm md:text-base"></i>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-square-x-twitter p-2 text-white text-sm md:text-base"></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-square-instagram p-2 text-white text-sm md:text-base"></i>
                    </a>
                </div>
                
                {/* Seller Join Button - Top Right */}
                <button 
                    onClick={handleSellerJoin}
                    className="hidden md:flex items-center text-white text-xs md:text-sm font-medium hover:bg-red-400 px-2 py-1 rounded transition"
                >
                    <i className="fa-solid fa-store mr-1"></i> Join as Seller
                </button>
            </div>

            {/* Main Header */}
            <div className="header-main h-auto md:h-[100px] w-full border border-red-200 flex flex-col md:flex-row justify-between items-center px-4 md:px-8 py-4">
                {/* Logo */}
                <div>
                    <a href="#">
                        <img
                            src={Logo}
                            className="h-[40px] w-[100px] md:h-[80px] md:w-[140px] object-contain"
                            alt="Logo"
                        />
                    </a>
                </div>
   
                {/* Search Bar */}
                <div className="relative w-full md:w-[460px] lg:w-[600px] mt-4 md:mt-0">
                    <div className="flex items-center w-full py-2 rounded-md border border-red-300 bg-white shadow-sm">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="form-control flex-grow px-4 py-2 outline-none text-gray-600 text-sm md:text-base"
                            value={search}
                            onChange={handleSearch}
                        />
                        <i className="fa fa-search text-gray-400 mx-3 text-sm md:text-base"></i>
                    </div>

                    {/* Search Results */}
                    {search && (
                        <div className="absolute z-10 mt-1 w-full max-h-[200px] overflow-y-auto bg-white shadow-md rounded-lg p-2">
                            {filteredProducts.length > 0 ? (
                                <ul className="space-y-2">
                                    {filteredProducts.map((product, index) => (
                                        <li
                                            key={index}
                                            onClick={() => ViewProduct(product.product_name)}
                                            className="hover:text-red-400 transition cursor-pointer text-sm md:text-base"
                                        >
                                            {safe(product,'product_name')}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm md:text-base">No products found for "{search}".</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Icons Section */}
                <div className="flex justify-center items-center space-x-4 mt-4 md:mt-0 md:space-x-6">

                    
                    {/* User Profile */}
                    <Link to={isAuthenticated ? "/profile" : "/login"}>
                        <i className="fa-regular fa-user text-red-400 text-xl md:text-3xl"></i>
                    </Link>
                    
                    {/* Wishlist */}
                    <Link to="/wishlistview">
                        <i className="fa-regular fa-heart text-red-400 text-xl md:text-3xl"></i>
                    </Link>

                                        {/* Notification Icon with Badge */}
                    <Link to="/notifications" className="relative">
                        <i className="fa-solid fa-bell text-red-400 text-xl md:text-3xl"></i>
                            {!accessToken || accessToken.length === 0?
                            <span></span>:
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {countsN}
                            </span>
                            }
                           
                       
                    </Link>
                    
                    {/* Cart */}
                    <Link to="/cartpage">
                        <i className="fa-solid fa-bag-shopping text-red-400 text-xl md:text-3xl"></i>
                    </Link>
                    
                    {/* Seller Join Button - Mobile */}
                    <button 
                        onClick={handleSellerJoin}
                        className="md:hidden flex items-center text-red-500 text-sm font-medium hover:bg-red-50 px-2 py-1 rounded transition"
                    >
                        <i className="fa-solid fa-store mr-1"></i> Seller
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <div className="header-bottom h-auto w-full flex justify-center mb-2">
                <div className="w-full max-w-screen-lg flex flex-wrap justify-center items-center space-x-2">
                    <Link to="/" className="py-2 px-4 text-sm md:text-base mx-1 border-b-2 border-transparent hover:border-red-300 transition-all duration-200">
                        HOME
                    </Link>
                    {Object.keys(dropdownOptions).map((key) => (
                        <button
                            key={key}
                            onMouseEnter={() => handleMouseEnter(key)}
                            onMouseLeave={handleMouseLeave}
                            className="py-2 px-4 text-sm md:text-base mx-1 border-b-2 border-transparent hover:border-red-300 transition-all duration-200"
                        >
                            {key.replace("Wear", "").toUpperCase()}
                        </button>
                    ))}
                    <Link to="/offerproduct" className="py-2 px-4 text-sm md:text-base mx-1 border-b-2 border-transparent hover:border-red-300 transition-all duration-200">
                        OFFERS
                    </Link>
                    <Link to="/compareproducts/40" className="py-2 px-4 text-sm md:text-base mx-1 border-b-2 border-transparent hover:border-red-300 transition-all duration-200">
                        COMPARE
                    </Link>
                </div>
            </div>

            {/* Dropdown Menu */}
            {activeDropdown && (
                <div
                    onMouseEnter={() => handleMouseEnter(activeDropdown)}
                    onMouseLeave={handleMouseLeave}
                    className="absolute w-[90%] max-w-screen-lg bg-white shadow-lg top-[180px] left-1/2 transform -translate-x-1/2 rounded-md grid grid-cols-2 md:grid-cols-4 gap-4 p-4 z-50 transition-transform"
                >
                    {dropdownOptions[activeDropdown]?.map((option, index) => {
                        const filteredData = subcate.filter(
                            (product) =>
                                safe(product,'category.category_description') === option &&
                                safe(product,'category.category_name') === activeDropdown
                        );
                        return (
                            <div key={index} className="flex flex-col">
                                <h1 className="font-semibold text-red-500 mb-2">{option}</h1>
                                {filteredData.slice(0,8).map((value, subIndex) => (
                                    <ul key={subIndex} className="space-y-1">
                                        <li onClick={()=>ViewProduct(value.product_name)} className="hover:text-red-400 transition">
                                            {safe(value,'product_name') || "Sub-item 1"}
                                        </li>
                                    </ul>
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}
            <ToastContainer /> 
        </header>
    );
};

export default Header;