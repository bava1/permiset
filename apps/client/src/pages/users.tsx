import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Paper,
  TablePagination,
  Tooltip,
  Chip,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import ProtectedRoute from "../components/ProtectedRoute";
import { fetchUsers, createUser, updateUser, deleteUser } from "../api/users";
import UserModal from "../components/UserModal";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import Image from 'next/image';
import { User } from "../utils/interfaces/IUser";
import { useTheme } from '@mui/material/styles';

const UsersPage: React.FC = () => {
  const { hasPermission, user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fields for filtering
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Pagination
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(8);
  console.log(user);

  // Loading user list
  const loadUsers = async () => {
    setError("");
    try {
      setLoading(true);
      const data = await fetchUsers();

      const sortedUsers = data.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || a.id).getTime();
        const dateB = new Date(b.createdAt || b.id).getTime();
        return dateB - dateA; // Sort by descending order of creation
      });

      setUsers(sortedUsers);
      console.log(users);
      setFilteredUsers(sortedUsers);
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

  // Updating the list when changing filters
  useEffect(() => {
    let updatedUsers = users;

    if (searchQuery) {
      updatedUsers = updatedUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRole) {
      updatedUsers = updatedUsers.filter((user) => user.role === selectedRole);
    }

    setFilteredUsers(updatedUsers);
  }, [searchQuery, selectedRole, users]);

  const resetSearch = () => {
    setSearchQuery("");
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Modal and user deletion handlers
  const openAddModal = () => {
    setSelectedUser(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setError("");
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUserOrEditUser = async (userData: {
    id?: string;
    name: string;
    email: string;
    password?: string;
    role: string;
    status: string;
  }) => {
    try {
      if (userData.id) {
        // User update
        await updateUser(userData.id, {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          status: userData.status,
        });
      } else {
        // Creating a new user
        await createUser({
          name: userData.name,
          email: userData.email,
          password: userData.password as string,
          role: userData.role,
          status: userData.status,
        });
      }

      await loadUsers();
      handleCloseModal();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save user.");
    }
  };

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

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
const theme = useTheme();
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

  return (
    <ProtectedRoute>
      <Box>
        <h1>Users Management</h1>
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
            {/* Filters */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Search by Name"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <IconButton onClick={resetSearch} size="small">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Administrator">Administrator</MenuItem>
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                </Select>
              </FormControl>
              {hasPermission("create") && ( // Check for creation
                <Button
                  variant="contained"
                  color="primary"
                  onClick={openAddModal}
                  sx={{ ml: "auto" }}
                >
                  Add User
                </Button>
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", ml: "80px", width: "90%" }}>
              <Typography sx={{ width: "25%" }} variant="subtitle1"><strong>Name:</strong></Typography>
              <Typography sx={{ width: "24%" }} variant="body2"><strong>Email:</strong></Typography>
              <Typography sx={{ width: "18%" }} variant="body2"><strong>Role:</strong></Typography>
              <Typography sx={{ width: "30%" }} variant="body2"><strong>Status:</strong></Typography>
              <Typography sx={{ width: "5%" }} variant="body2"><strong>Active:</strong></Typography>
            </Box>

            {/* User List */}
            <Box>
              {paginatedUsers.map((userItem, index) => (
                <Paper
                  key={userItem.id}
                  elevation={1}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 1,
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between", alignItems: "center", width: "80%" }}>
                    <Image style={{ borderRadius: "4px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"}} src={`/imgContact/img${index + 1}.jpg`} alt="Logo" width={50} height={50} />
                    <Typography sx={{ width: "30%", fontWeight: 'bold' }} variant="body2">{userItem.name}</Typography>
                    <Typography sx={{ width: "30%" }} variant="body2">{userItem.email}</Typography>
                    <Typography sx={{ width: "25%" }} variant="body2">
                      <Chip sx={{ opacity: 0.6, px: 1, fontWeight: 700, backgroundColor: getChipColor(userItem.role), color: "black" }} label={userItem.role} size="small" />
                    </Typography>
                    <Typography sx={{ width: "20%" }} variant="body2">{userItem.status}</Typography>
                  </Box>
                  <Box sx={{ mr: "7px"}}>
                    {user && userItem.id === user.id && user.role === "Administrator" ? (
                      <Tooltip title="You can't change yourself!" placement="left-start">
                        <Typography variant="subtitle2" color="info" sx={{ pr: 1 }}>Logged in</Typography>
                      </Tooltip>
                    ) : (
                      <>
                        {hasPermission("update") && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => openEditModal(userItem)}
                          >
                            Edit
                          </Button>
                        )}
                        {hasPermission("delete") && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => openDeleteDialog(userItem)}
                            sx={{ ml: 1 }}
                          >
                            Delete
                          </Button>
                        )}
                      </>
                    )}
                  </Box>
                </Paper>
              ))}
            </Box>
            {filteredUsers.length > 8 && (
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

        {/* Modal */}
        <UserModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveUserOrEditUser}
          initialData={modalMode === "edit" ? selectedUser || undefined : undefined}
          mode={modalMode}
        />

        {/* Delete dialog */}
        <ConfirmDialog
          open={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDeleteUser}
          title="Confirm Deletion"
          content={`Are you sure you want to delete user \"${selectedUser?.name}\" (${selectedUser?.email})?`}
          confirmText="Delete"
          cancelText="No"
          confirmColor="error"
        />
      </Box>
    </ProtectedRoute>
  );
};

export default UsersPage;
