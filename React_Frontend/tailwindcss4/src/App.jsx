import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import axiosInstance from "./utils/axiosInstance";
import { loginSuccess } from "./redux/authSlice";

// Import pages
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import SellerRoutes from "./routes/SellerRoutes";

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
                <Route path="/*" element={<UserRoutes/>}/>
                <Route path="/admin/*" element={<AdminRoutes/>}/>
                <Route path="/seller/*" element={<SellerRoutes/>}/>
            </Routes>
        </div>
    );
};

export default App;
