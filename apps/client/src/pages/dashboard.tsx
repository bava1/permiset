import { Box, Typography } from "@mui/material";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <ProtectedRoute>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Welcome to the Dashboard! Only authorized users can see this page.
        </Typography>
        {user && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Logged in as: {user.email} ({user.role})
          </Typography>
        )}
      </Box>
    </ProtectedRoute>
  );
}
