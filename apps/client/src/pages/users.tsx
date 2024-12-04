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
import { useAuth } from "../context/AuthContext"; // Route protection
import ProtectedRoute from "../components/ProtectedRoute";
import { fetchUsers, createUser } from "../api/users"; // API for working with users
import AddUserModal from "../components/UserModal";


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
  const [isModalOpen, setModalOpen] = useState<boolean>(false); // State for modal window

  // Getting user data
  useEffect(() => {
    const getUsers = async () => {
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

    getUsers();
  }, []);

  // Open modal window
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  // Close modal window
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Save new user
  const handleSaveUser = async (userData: {
    name: string;
    email: string;
    role: string;
    status: string;
  }) => {
    try {
      const newUser = await createUser(userData);
      setUsers((prevUsers) => [...prevUsers, newUser]); // Updating the user list
    } catch (err) {
      console.error("Failed to create user:", err);
    } finally {
      handleCloseModal();
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
          <>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenModal} 
              >
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
                        <Button size="small" variant="outlined" color="primary">
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          sx={{ ml: 1 }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Modal window */}
        <AddUserModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveUser} // Saving a new user
        />
      </Box>
    </ProtectedRoute>
  );
};

export default UsersPage;
