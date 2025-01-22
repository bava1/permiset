import React from "react";
import { Box, Typography, Button, Tooltip, Chip, Paper } from "@mui/material";
import Image from "next/image";
import { UserItemProps } from "../utils/interfaces/IUserItemProps";



const UserItem: React.FC<UserItemProps> = ({
  userItem,
  hasPermission,
  openEditModal,
  openDeleteDialog,
  user,
  getChipColor,
}) => {
  const renderUserAvatar = (userItem: any) => {
    return userItem.userImg ? (
      <Image
        style={{
          borderRadius: "4px",
          boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.4)",
        }}
        src={`/imgContact/${userItem.userImg}.jpg`}
        alt="Logo"
        width={50}
        height={50}
      />
    ) : (
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: "4px",
          backgroundColor: "#1976d2",
          opacity: 0.8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 20,
          fontWeight: "bold",
          boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.3)",
        }}
      >
        {userItem.name ? userItem.name.charAt(0).toUpperCase() : "?"}
      </Box>
    );
  };

  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 1,
        mb: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          alignItems: "center",
          width: "80%",
        }}
      >
        <Box sx={{ width: "50px", height: "50px" }}>
          {renderUserAvatar(userItem)}
        </Box>
        <Typography
          sx={{ width: "30%", fontWeight: "bold" }}
          variant="body2"
        >
          {userItem.name}
        </Typography>
        <Typography sx={{ width: "30%" }} variant="body2">
          {userItem.email}
        </Typography>
        <Typography sx={{ width: "25%" }} variant="body2">
          <Chip
            sx={{
              opacity: 0.7,
              px: 1,
              fontWeight: 700,
              backgroundColor: getChipColor(userItem.role),
              color: "black",
              boxShadow: 1
            }}
            label={userItem.role}
            size="small"
          />
        </Typography>
        {userItem.status === "active" ? (
          <Typography sx={{ width: "20%", color: "green" }} variant="body2">
            Active
          </Typography>
        ) : (
            <Typography sx={{ width: "20%", color: "red" }} variant="body2">
            Inactive
          </Typography>
        )}
      </Box>
      <Box sx={{ mr: "7px" }}>
        {user && userItem.id === user.id && user.role === "Administrator" ? (
          <Tooltip title="You can't change yourself!" placement="left-start">
            <Typography variant="subtitle2" color="info" sx={{ pr: 1 }}>
              Logged in
            </Typography>
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
  );
};

export default UserItem;
