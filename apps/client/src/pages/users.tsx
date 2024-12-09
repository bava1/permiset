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
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  TablePagination,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
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

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
      await loadUsers();
      handleCloseDeleteDialog();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete user.";
      console.error("Failed to delete user:", errorMessage);
      setError(errorMessage);
    }
  };

  // Displaying a table
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <ProtectedRoute>
      <Box>
        <h1>Users</h1>
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
              <Button
                variant="contained"
                color="primary"
                onClick={openAddModal}
                sx={{ ml: "auto" }}
              >
                Add User
              </Button>
            </Box>

            {/* Table */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell sx={{ display: "flex", justifyContent: "flex-end" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell sx={{ display: "flex", justifyContent: "flex-end" }}>
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

            {/* Pagination */}
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

        {/* Modal window for adding/editing */}
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
