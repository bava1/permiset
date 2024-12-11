import axiosClient from "./axiosClient";

// Обновление роли (добавление или удаление разрешений)
export const updateRole = async (roleId: string, updatedData: { name: string; permissions: string[] }) => {
  try {
    const response = await axiosClient.put(`/roles/${roleId}`, updatedData);
    return response.data; // Возвращаем обновлённую роль
  } catch (err: any) {
    console.error("Failed to update role:", err);
    throw new Error(err.response?.data?.message || "Failed to update role.");
  }
};

// Получение списка всех ролей
export const fetchRoles = async () => {
  try {
    const response = await axiosClient.get("/roles");
    return response.data; // Возвращаем список ролей
  } catch (err: any) {
    console.error("Failed to fetch roles:", err);
    throw new Error(err.response?.data?.message || "Failed to fetch roles.");
  }
};

// Получение роли по ID
export const fetchRoleById = async (roleId: string) => {
  try {
    const response = await axiosClient.get(`/roles/${roleId}`);
    return response.data; // Возвращаем данные роли
  } catch (err: any) {
    console.error("Failed to fetch role:", err);
    throw new Error(err.response?.data?.message || "Failed to fetch role.");
  }
};
