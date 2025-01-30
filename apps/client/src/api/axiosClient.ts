import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});

// ✅ Теперь используем `sessionStorage`, чтобы токен не терялся при смене языка
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

// ✅ Исправляем обработку 401 → больше НЕ вызываем logout
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Ошибка 401: Токен недействителен, но logout НЕ выполняем.");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;








    // baseURL: process.env.RENDER_EXPRESS_API_URL || "https://permiset-express-latest.onrender.com",