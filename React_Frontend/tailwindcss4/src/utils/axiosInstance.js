import axios from "axios";
import { store } from "../redux/store";
import { loginSuccess, logout } from "../redux/authSlice";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.accessToken;
    if (accessToken) {
      console.log("Token attached to request:", accessToken);
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Auto Refresh Token)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          {},
          { withCredentials: true }
        );

        console.log("New Access Token:", data.access);
        store.dispatch(loginSuccess({
          accessToken: data.access,
          isAuthenticated: true,
        }));

        originalRequest.headers["Authorization"] = `Bearer ${data.access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired, logging out...");
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
