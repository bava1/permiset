import { Button, Box, Typography } from "@mui/material";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";


export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter(); // Hook for routing

  const handleLogout = async () => {
    await logout(); // Call logout from AuthContext
    router.push("/auth/login"); // Redirect to the login page
  };

  return (
    <ProtectedRoute>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Welcome to the Dashboard! Only authorized users can see this page.
        </Typography>
        <Link href="/users" passHref>
          <Button variant="contained" color="primary">
            Go to Users Management
          </Button>
        </Link>
        <Button variant="contained" color="primary" sx={{ mt: 4 }} onClick={handleLogout}>
          Logout
        </Button>
        {user && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Logged in as: {user.email} ({user.role})
          </Typography>
        )}
      </Box>
    </ProtectedRoute>
  );
}
