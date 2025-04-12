import { useNavigate } from "react-router-dom"; // Importing useNavigate
import axios from "axios";
import { store } from "../redux/store";
import { loginSuccess, logout } from "../redux/authSlice";

const api = axios.create({
    baseURL: "https://127.0.0.1:8000/api",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                const res = await axios.post(
                    "https://127.0.0.1:8000/api/token/refresh/",
                    {},
                    { withCredentials: true }
                );
                store.dispatch(
                    loginSuccess({
                        user: res.data.user, // Make sure to include the user data
                        accessToken: res.data.accessToken,
                    })
                );

                // Re-attach the refreshed token to the original request
                error.config.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
                return axios(error.config);
            } catch (refreshError) {
                console.log("Refresh token expired", refreshError);
                store.dispatch(logout());

                // Use React Router's useNavigate for navigation
                const navigate = useNavigate();
                navigate("/"); // Navigate to the login page
            }
        }
        return Promise.reject(error);
    }
);

export default api;
