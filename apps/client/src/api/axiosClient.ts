import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.RENDER_PUBLIC_API_URL || "https://permiset-server-8-latest.onrender.com",
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
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
    console.error("Interceptor error:", error);
    // Логика обработки ошибок
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized. Redirecting to login.");
      // Очистка токенов и редирект на страницу логина
      localStorage.removeItem("auth_token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// Interceptor for handling responses
/*
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        console.warn("No refresh token available, logout.");
        return Promise.reject(error);
      }

      try {
        const { data } = await axiosClient.post("/auth/refresh", { refreshToken });
        localStorage.setItem("auth_token", data.token);

        // Обновляем токен в запросе и повторяем его
        error.config.headers.Authorization = `Bearer ${data.token}`;
        return axiosClient.request(error.config);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);

        // Очищаем данные при неудачном обновлении токена
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
*/

export default axiosClient;
