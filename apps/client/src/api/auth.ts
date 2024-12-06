import axiosClient from "./axiosClient";
import axios from "axios";

export const login = async (email: string, password: string) => {
  const response = await axiosClient.post("/auth/login", { email, password });
  return response.data; // Возвращаем данные с токенами
};

export const register = async (name: string, email: string, password: string) => {
  const response = await axiosClient.post("/auth/register", { name, email, password });
  return response.data;
};

export const verifyToken = async () => {
  const response = await axiosClient.get("/auth/verify");
  return response.data;
};

