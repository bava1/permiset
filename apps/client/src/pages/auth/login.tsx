import { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";

// Data Validation with Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Accessing AuthContext
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      // Data validation
      const validatedData = loginSchema.parse({ email, password });
  
      setLoading(true);
  
      // Call the login method from AuthContext
      await login(validatedData.email, validatedData.password);
  
      // Go to Dashboard page after successful login
      router.push("/dashboard");
    } catch (err: any) {
      setLoading(false); // We guarantee a boot reset
  
      // If the error came from the API
      if (err?.message === "Invalid credentials") {
        setError("Invalid credentials. Please try again.");
      } 
      // If validation error
      else if (err.errors) {
        setError(err.errors[0]?.message || "Validation error");
      } 
      // If an unknown error occurs
      else {
        console.error("An unexpected error occurred:", err);
        setError("An unexpected error occurred");
      }
    }
  };
  

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Loading..." : "Login"}
        </Button>
      </form>

      <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
        Don’t have an account? <a href="/auth/register">Register here</a>
      </Typography>
    </Box>
  );
}
