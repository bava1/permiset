import { useEffect, useState } from "react";
import { fetchUsers, createUser, updateUser, deleteUser } from "../../api/users";
import { User } from "../interfaces/IUser";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Загружаем пользователей
  const loadUsers = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await fetchUsers();
      const sortedUsers = data.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || a.id).getTime();
        const dateB = new Date(b.createdAt || b.id).getTime();
        return dateB - dateA;
      });
      setUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
    } catch (err: any) {
      console.error("Ошибка загрузки пользователей:", err);
      setError("Не удалось загрузить пользователей.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Функция сохранения (добавления / редактирования)
  const saveUser = async (userData: {
    id?: string;
    name: string;
    email: string;
    password?: string;
    role: string;
    status: string;
  }) => {
    try {
      if (userData.id) {
        await updateUser(userData.id, {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          status: userData.status,
        });
      } else {
        await createUser({
          name: userData.name,
          email: userData.email,
          password: userData.password as string,
          role: userData.role,
          status: userData.status,
        });
      }
      await loadUsers();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Ошибка при сохранении пользователя.");
    }
  };

  // Функция удаления пользователя
  const removeUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      await loadUsers();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Ошибка при удалении пользователя.");
    }
  };

  return {
    users,
    filteredUsers,
    setFilteredUsers,
    loading,
    error,
    saveUser,
    removeUser,
  };
};
