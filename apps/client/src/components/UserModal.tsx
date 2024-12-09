import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (userData: {
    id?: string;
    name: string;
    email: string;
    role: string;
    status: string;
    password?: string;
  }) => Promise<void>;
  initialData?: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  };
  mode: "add" | "edit";
}

const UserModal: React.FC<UserModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    name: initialData?.name || "",
    email: initialData?.email || "",
    role: initialData?.role || "User",
    status: initialData?.status || "active",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        ...initialData,
        password: "",
        confirmPassword: "",
      });
    }
  }, [initialData, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (name) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    setError("");
  
    // Check for password matches only if they exist
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
  
    try {
      setLoading(true);
  
      const payload: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
      };
      if (formData.password) payload.password = formData.password; 
      if (mode === "edit" && initialData?.id) payload.id = initialData.id;
  
      await onSave(payload);
  
      setFormData({
        id: "",
        name: "",
        email: "",
        role: "User",
        status: "active",
        password: "",
        confirmPassword: "",
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{mode === "add" ? "Add New User" : "Edit User"}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="email"
          disabled={mode === "edit"}
        />
        {mode === "add" && (
          <>
            <TextField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="password"
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="password"
            />
          </>
        )}
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={formData.role}
            onChange={handleSelectChange}
          >
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Administrator">Administrator</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleSelectChange}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;
