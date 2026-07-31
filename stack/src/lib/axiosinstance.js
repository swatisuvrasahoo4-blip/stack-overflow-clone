import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});
let isLoggingOut = false;
// Request Interceptor
axiosInstance.interceptors.request.use((req) => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");

    if (user) {
      const token = JSON.parse(user).token;

      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    }
  }

  return req;
});
axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    const storedUser = localStorage.getItem("user");
    if (error.response?.status === 401 && storedUser && !isLoggingOut) {
      isLoggingOut = true;

      localStorage.removeItem("user");

      alert("Your session has expired. Please login again.");

      window.location.replace("/auth");
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;