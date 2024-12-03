import React from "react";
import { useAuth } from "../context/AuthContext";

const AuthTest: React.FC = () => {
  const { user, login, logout, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await login("john.doe@example.com", "password123");
      alert("Login successful!");
    } catch (err) {
      if (err instanceof Error) {
        alert("Login failed: " + err.message);
      } else {
        alert("Login failed: Unknown error");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Auth Test</h2>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.email}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default AuthTest;

