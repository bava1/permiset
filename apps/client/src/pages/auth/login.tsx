import { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext"; // Используем AuthContext

// Валидация данных с помощью Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Доступ к AuthContext
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Валидация данных
      const validatedData = loginSchema.parse({ email, password });

      setLoading(true);
      // Вызов метода login из AuthContext
      await login(validatedData.email, validatedData.password);

      setLoading(false);
    } catch (err: any) {
      setLoading(false);

      // Если ошибка валидации
      if (err.errors) {
        setError(err.errors[0].message);
      } else {
        // Ошибка авторизации
        setError(err.message || "Invalid credentials");
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
