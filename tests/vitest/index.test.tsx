import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AuthContext } from "../../apps/client/src/context/AuthContext";
import Home from "../../apps/client/src/pages/index";
import '@testing-library/jest-dom';

describe("Home Page", () => {
  it("renders user information correctly", () => {
    // Mock user data
    const mockUser = {
      id: "12345", // Добавляем обязательное поле id
      name: "John Doe",
      role: "Admin",
      email: "john.doe@example.com",
      status: "active",
      createdAt: "2023-01-01T12:00:00Z",
      updatedAt: "2023-12-01T12:00:00Z",
    };

    // Wrap the component with mocked AuthContext
    render(
      <AuthContext.Provider
        value={{
          user: mockUser,
          token: null,
          permissions: [],
          login: vi.fn(), // Используем vi вместо jest
          register: vi.fn(),
          logout: vi.fn(),
          isAuthenticated: true,
          isAuthLoading: false,
          hasPermission: vi.fn(),
        }}
      >
        <Home />
      </AuthContext.Provider>
    );

    // Check the rendered text
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Admin/i)).toBeInTheDocument();
    expect(screen.getByText(/john.doe@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });
});
