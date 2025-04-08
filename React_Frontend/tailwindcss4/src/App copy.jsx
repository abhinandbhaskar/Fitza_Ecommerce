import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import axiosInstance from "./utils/axiosInstance";
import { loginSuccess } from "./redux/authSlice";

// Import pages
import HomePage from "./pages/User/HomePage/HomePage";
import SignUpPage from "./pages/User/SignUpPage/SignUpPage";
import LoginPage from "./pages/User/LoginPage/LoginPage";
import ProfilePage from "./pages/User/ProfilePage/ProfilePage";
import ViewProfile from "./components/User/ProfileComponents/ViewProfile/ViewProfile";
import ChangePassword from "./components/User/ProfileComponents/ChangePassword/ChangePassword";
import BillingAddress from "./components/User/ProfileComponents/BillingAddress/BillingAddress";
import ProductPage from "./pages/User/ProductPage/ProductPage";
import HandleRedirect from "./pages/User/HandleRedirect/HandleRedirect";

const App = () => {
    const dispatch = useDispatch();
    const accessToken = useSelector((state) => state.auth.accessToken);
    const [authChecked, setAuthChecked] = useState(false); // 🔐 check complete

    useEffect(() => {
        const refreshAccessToken = async () => {
            try {
                const { data } = await axiosInstance.post("api/token/refresh/");
                dispatch(
                    loginSuccess({
                        accessToken: data.access,
                        isAuthenticated: true,
                    })
                );
                console.log("🔐 Token refreshed successfully");
            } catch (error) {
                console.error("❌ Failed to refresh token:", error);
            } finally {
                setAuthChecked(true); // ✅ done checking
            }
        };

        if (!accessToken) {
            refreshAccessToken();
        } else {
            setAuthChecked(true); // already has token
        }
    }, [dispatch, accessToken]);

    // 🚫 Wait until token check is done
    if (!authChecked) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/authredirect" element={<HandleRedirect />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/viewprofile" element={<ViewProfile />} />
                <Route path="/changepassword" element={<ChangePassword />} />
                <Route path="/billingaddress" element={<BillingAddress />} />
                <Route path="/productview" element={<ProductPage />} />
            </Routes>
        </div>
    );
};

export default App;
