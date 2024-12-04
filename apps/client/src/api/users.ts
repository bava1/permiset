import axiosClient from "./axiosClient";

// Получение списка пользователей
export const fetchUsers = async () => {
  try {
    const response = await axiosClient.get("/users");
    return response.data; // Возвращаем данные пользователей
  } catch (err) {
    console.error("Error fetching users:", err);
    throw new Error("Failed to fetch users");
  }
};

// Создание нового пользователя
export const createUser = async (user: { name: string; email: string; role: string; status: string }) => {
  try {
    const response = await axiosClient.post("/users", user);
    return response.data; // Возвращаем созданного пользователя
  } catch (err) {
    console.error("Error creating user:", err);
    throw new Error("Failed to create user");
  }
};

// Обновление данных пользователя
export const updateUser = async (id: string, updatedData: { name?: string; email?: string; role?: string; status?: string }) => {
  try {
    const response = await axiosClient.put(`/users/${id}`, updatedData);
    return response.data; // Возвращаем обновленные данные
  } catch (err) {
    console.error("Error updating user:", err);
    throw new Error("Failed to update user");
  }
};

// Удаление пользователя
export const deleteUser = async (id: string) => {
  try {
    await axiosClient.delete(`/users/${id}`);
  } catch (err) {
    console.error("Error deleting user:", err);
    throw new Error("Failed to delete user");
  }
};
