import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import ProtectedRoute from "../components/ProtectedRoute";
import { fetchUsers, createUser, updateUser, deleteUser } from "../api/users";
import UserModal from "../components/UserModal";
import ConfirmDialog from "../components/ConfirmDialog";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Загрузка списка пользователей
  const loadUsers = async () => {
    setError("");
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Открытие модального окна для добавления
  const openAddModal = () => {
    setSelectedUser(null);
    setModalMode("add");
    setModalOpen(true);
  };

  // Открытие модального окна для редактирования
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setModalMode("edit");
    setModalOpen(true);
  };

  // Закрытие модального окна
  const handleCloseModal = () => {
    setModalOpen(false);
    setError("");
  };

  // Открытие диалога удаления
  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // Закрытие диалога удаления
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  // Унифицированный обработчик для добавления/редактирования пользователя
  const handleSaveUserOrEditUser = async (userData: {
    id?: string;
    name: string;
    email: string;
    role: string;
    status: string;
  }) => {
    try {
      if (userData.id) {
        // Редактирование
        await updateUser(userData.id, {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          status: userData.status,
        });
      } else {
        // Добавление нового пользователя
        await createUser({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          status: userData.status,
        });
      }
      await loadUsers();
      handleCloseModal();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to save user. Please try again.";
      if (err.response?.status === 400 || err.response?.status === 409) {
        setError("User with this email already exists.");
      } else {
        console.error("Failed to save user:", errorMessage);
        setError(errorMessage);
      }
    }
  };

  // Удаление пользователя
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
      await loadUsers(); // Перезагрузка списка пользователей
      handleCloseDeleteDialog();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete user.";
      console.error("Failed to delete user:", errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <ProtectedRoute>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>

        {loading ? (
          <Box sx={{ textAlign: "center", marginTop: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        ) : (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Button variant="contained" color="primary" onClick={openAddModal}>
                Add User
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => openEditModal(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          sx={{ ml: 1 }}
                          onClick={() => openDeleteDialog(user)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Модальное окно для добавления/редактирования */}
        <UserModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveUserOrEditUser}
          initialData={modalMode === "edit" ? selectedUser || undefined : undefined}
          mode={modalMode}
        />

        {/* Диалог удаления */}
        <ConfirmDialog
          open={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDeleteUser}
          title="Confirm Deletion"
          content={`Are you sure you want to delete user "${selectedUser?.name}" (${selectedUser?.email})?`}
          confirmText="Delete"
          cancelText="No"
          confirmColor="error"
        />
      </Box>
    </ProtectedRoute>
  );
};

export default UsersPage;
