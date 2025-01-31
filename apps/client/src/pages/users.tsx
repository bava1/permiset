import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, CircularProgress, TablePagination, Button } from "@mui/material";
import ProtectedRoute from "../components/ProtectedRoute";
import { fetchUsers, createUser, updateUser, deleteUser } from "../api/users";
import UserModal from "../components/UserModal";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import UserItem from "../components/UserItem";
import { User } from "../utils/interfaces/IUser";
import { useTheme } from "@mui/material/styles";
import UserFilters from "../components/UserFilters";
import { useTranslation } from "react-i18next";

const UsersPage: React.FC = () => {
  const { hasPermission, user } = useAuth();
  const theme = useTheme();
  const { t } = useTranslation("common");

  // ✅ States
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // ✅ Modal windows
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // ✅ Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // ✅ Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  // ✅ Color for the role

  const getChipColor = (role: string) => {
    switch (role) {
      case "Administrator":
        return theme.palette.customColors.administrator;
      case "Manager":
        return theme.palette.customColors.manager;
      case "User":
      default:
        return theme.palette.customColors.user;
    }
  };

  // ✅ Loading users
  const loadUsers = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const data = await fetchUsers();
      const sortedUsers = data.sort(
        (a: any, b: any) => new Date(b.createdAt || b.id).getTime() - new Date(a.createdAt || a.id).getTime()
      );
      setUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // ✅ Filtering users
  useEffect(() => {
    let updatedUsers = users;
    if (searchQuery) {
      updatedUsers = updatedUsers.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedRole) {
      updatedUsers = updatedUsers.filter((u) => u.role === selectedRole);
    }
    if (selectedStatus) {
      updatedUsers = updatedUsers.filter((u) => u.status === selectedStatus);
    }
    setFilteredUsers(updatedUsers);
  }, [searchQuery, selectedRole, selectedStatus, users]);

  // ✅ Reset search
  const resetSearch = () => setSearchQuery("");

  // ✅ Manage pages
  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ✅ Opening a modal window
  const openModal = (mode: "add" | "edit", user: User | null = null) => {
    setSelectedUser(user);
    setModalMode(mode);
    setModalOpen(true);
  };

  // ✅ Closing the modal window
  const handleCloseModal = () => {
    setModalOpen(false);
    setError("");
  };

  // ✅ Opening the delete dialog
  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // ✅ Closing the delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  // ✅ Create or update user
  const handleSaveUserOrEditUser = async (userData: Partial<User>) => {
    try {
      userData.id
        ? await updateUser(userData.id, userData)
        : await createUser(userData as Required<User>);
      await loadUsers();
      handleCloseModal();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save user.");
    }
  };

  // ✅ Deleting a user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
      await loadUsers();
      handleCloseDeleteDialog();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <ProtectedRoute>
      <Box>
        <h1>{t("users_users_Management")}</h1>
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
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <UserFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                resetSearch={resetSearch}
              />
              {hasPermission("create") && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => openModal("add")}
                  sx={{ ml: "auto", height: "56px" }}
                >
                  Add User
                </Button>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", ml: "90px", width: "90%" }}>
              {["Name", "Email", "Role", "Status", "Action"].map((header, index) => (
                <Typography key={index} sx={{ width: `${index === 4 ? "5%" : "24%"}` }} variant="body2">
                  <strong>{header}:</strong>
                </Typography>
              ))}
            </Box>

            <Box>
              {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((userItem) => (
                <UserItem
                  key={userItem.id}
                  userItem={userItem}
                  hasPermission={hasPermission}
                  openEditModal={() => openModal("edit", userItem)}
                  openDeleteDialog={openDeleteDialog}
                  user={user}
                  getChipColor={getChipColor}
                />
              ))}
            </Box>

            {filteredUsers.length > rowsPerPage && (
              <TablePagination
                component="div"
                count={filteredUsers.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[8, 16, 24]}
              />
            )}
          </Box>
        )}

        <UserModal 
          open={isModalOpen} 
          onClose={handleCloseModal} 
          onSave={handleSaveUserOrEditUser} 
          initialData={modalMode === "edit" ? selectedUser || undefined : undefined} mode={modalMode} 
        />

        <ConfirmDialog 
          open={isDeleteDialogOpen} 
          onClose={handleCloseDeleteDialog} 
          onConfirm={handleDeleteUser} 
          title="Confirm Deletion" 
          content={`Are you sure you want to delete "${selectedUser?.name}"?`} 
          confirmText="Delete" 
          cancelText="No" 
          confirmColor="error" 
        />

      </Box>
    </ProtectedRoute>
  );
};

export default UsersPage;
