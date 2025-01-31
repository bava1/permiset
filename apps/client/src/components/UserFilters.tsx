// components/UserFilters.tsx
import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { UserFiltersProps } from "../utils/interfaces/IUserFiltersProps";


const UserFilters: React.FC<UserFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedRole,
  setSelectedRole,
  selectedStatus,
  setSelectedStatus,
  resetSearch,
}) => {
  return (
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
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default UserFilters;