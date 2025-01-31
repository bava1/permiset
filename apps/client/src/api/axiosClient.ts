import axios from "axios";

const axiosClient = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  baseURL: process.env.RENDER_EXPRESS_API_URL || "https://permiset-express-latest.onrender.com",
});

// ✅ Now we use `sessionStorage` so that the token is not lost when changing the language
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Fix 401 handling → NO LONGER calling logout
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️Error 401: Token is invalid, but logout is NOT performed.");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;