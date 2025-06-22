import React, { useState, useEffect } from "react";
import "./MyProfile.css";
import axios from "axios";
import ViewProfile from "../../../components/User/ProfileComponents/ViewProfile/ViewProfile";
import ChangePassword from "../../../components/User/ProfileComponents/ChangePassword/ChangePassword";
import BillingAddress from "../../../components/User/ProfileComponents/BillingAddress/BillingAddress";
import ShippingAddress from "../ProfileComponents/ShippingAddress/ShippingAddress";
import MyOrders from "../ProfileComponents/MyOrders/MyOrders";
import DeleteAccount from "../ProfileComponents/DeleteAccount/DeleteAccount";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/authActions";
import { clearProfile } from "../../../redux/profileSlice";
import ProductsDetailView from "../ProfileComponents/MyOrders/MyOrderComponents/ProductsDetailView";
import SellerFeedBack from "../ProfileComponents/MyOrders/MyOrderComponents/SellerFeedBack";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyProfile = ({currentView,setCurrentView}) => {
    const [myorderview, setMyOrderView] = useState("myorder");
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const { name, email, profilePicture } = useSelector((state) => state.profile.user);
    const dispatch = useDispatch();
    const { accessToken } = useSelector((state) => state.auth);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(
                "https://127.0.0.1:8000/api/logout/",
                {},
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            dispatch(
                clearProfile({
                    name: null,
                    email: null,
                    profilePicture: null,    
                })
            );
            dispatch(logoutUser());
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed...");
        }
    };

    const handleMyOrders = () => {
        setCurrentView("myorders");
        setMyOrderView("myorder");
        if (isMobile) setShowMobileMenu(false);
    };

    const handleMenuItemClick = (id) => {
        setCurrentView(id);
        if (isMobile) setShowMobileMenu(false);
    };

    const menuItems = [
        { id: "profile", label: "Account Details", icon: "👤" },
        { id: "password", label: "Change Password", icon: "🔑" },
        { id: "billing", label: "Billing Address", icon: "🏠" },
        { id: "shipping", label: "Shipping Address", icon: "🚚" },
        { id: "myorders", label: "My Orders", icon: "🛒", action: handleMyOrders },
        { id: "delete", label: "Delete Account", icon: "🗑️" },
    ];

    return (
        <div className="profile-container">
            <div className="profile-sidebar">
                <div className="profile-header">
                    <div className="avatar-container">
                        <img 
                            src={profilePicture || "https://via.placeholder.com/150"} 
                            className="profile-avatar" 
                            alt="Profile" 
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = "https://via.placeholder.com/150";
                            }}
                        />
                    </div>
                    <h2 className="profile-name">{name || "User"}</h2>
                    <p className="profile-email">{email || "user@example.com"}</p>
                </div>

                {isMobile ? (
                    <div className="mobile-menu-container">
                        <button 
                            className="mobile-menu-toggle"
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                        >
                            {showMobileMenu ? "▲ Close Menu" : "▼ Open Menu"}
                        </button>
                        
                        {showMobileMenu && (
                            <nav className="profile-menu mobile">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={item.action || (() => handleMenuItemClick(item.id))}
                                        className={`menu-item ${currentView === item.id ? "active" : ""}`}
                                    >
                                        <span className="menu-icon">{item.icon}</span>
                                        <span className="menu-label">{item.label}</span>
                                    </button>
                                ))}
                                
                                <button 
                                    onClick={handleLogout} 
                                    className="menu-item logout-button"
                                >
                                    <span className="menu-icon">🚪</span>
                                    <span className="menu-label">Sign Out</span>
                                </button>
                            </nav>
                        )}
                    </div>
                ) : (
                    <nav className="profile-menu">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={item.action || (() => setCurrentView(item.id))}
                                className={`menu-item ${currentView === item.id ? "active" : ""}`}
                            >
                                <span className="menu-icon">{item.icon}</span>
                                <span className="menu-label">{item.label}</span>
                            </button>
                        ))}
                        
                        <button 
                            onClick={handleLogout} 
                            className="menu-item logout-button"
                        >
                            <span className="menu-icon">🚪</span>
                            <span className="menu-label">Sign Out</span>
                        </button>
                    </nav>
                )}
            </div>

            <div className="profile-content">
                {currentView === "profile" && <ViewProfile />}
                {currentView === "password" && <ChangePassword />}
                {currentView === "billing" && <BillingAddress />}
                {currentView === "shipping" && <ShippingAddress />}
                {currentView === "myorders" && (
                    <MyOrders 
                        setCurrentView={setCurrentView} 
                        myorderview={myorderview} 
                        setMyOrderView={setMyOrderView} 
                    />
                )}
                {currentView.view === "productdetail" && (
                    <ProductsDetailView 
                        setMyOrderView={setMyOrderView}
                        currentView={currentView} 
                        setCurrentView={setCurrentView} 
                    />
                )}
                {currentView === "delete" && <DeleteAccount />}
                {currentView.view1 === "sellerfeedback" && (
                    <SellerFeedBack setCurrentView={setCurrentView} setMyOrderView={setMyOrderView} currentView={currentView} />
                )}
            </div>
            <ToastContainer /> 
        </div>
    );
};

export default MyProfile;