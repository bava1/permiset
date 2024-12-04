import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});

// Interceptor for adding token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // If the token has expired, try refreshing the token
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const { data } = await axiosClient.post("/auth/refresh", { refreshToken });
          localStorage.setItem("auth_token", data.token); // Updating the token
          error.config.headers.Authorization = `Bearer ${data.token}`; // Повторяем запрос
          return axiosClient.request(error.config);
        }
      } catch (refreshError) {
        console.error("Unable to refresh token:", refreshError);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
      }
    }
    return Promise.reject(error);
  }
);


export default axiosClient;
