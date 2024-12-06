import { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { z, ZodError } from "zod";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Очищаем ошибки перед новой попыткой

    try {
      setLoading(true);
      const validatedData = loginSchema.parse({ email, password });
      await login(validatedData.email, validatedData.password);
      router.push("/dashboard"); // Переход на страницу Dashboard
    } catch (err: any) {
      if (err instanceof ZodError) {
        setError(err.errors[0]?.message || "Validation error");
      } else if (err.message === "Invalid credentials") {
        setError("Invalid credentials. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Гарантируем сброс загрузки
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
          name="email"
          value={email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
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
