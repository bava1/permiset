import axiosClient from "./axiosClient";

// Getting a list of users
export const fetchUsers = async () => {
  try {
    const response = await axiosClient.get("/users");
    return response.data; // Returning user data
  } catch (err) {
    console.error("Error fetching users:", err);
    throw new Error("Failed to fetch users");
  }
};

// Creating a new user
export const createUser = async (user: { name: string; email: string; role: string; status: string }) => {
  try {
    const response = await axiosClient.post("/users", user);
    return response.data; // Returning the created user
  } catch (err) {
    console.error("Error creating user:", err);
    throw new Error("Failed to create user");
  }
};

// Updating user data
export const updateUser = async (id: string, updatedData: { name?: string; email?: string; role?: string; status?: string }) => {
  try {
    const response = await axiosClient.put(`/users/${id}`, updatedData);
    return response.data; // Returning updated data
  } catch (err) {
    console.error("Error updating user:", err);
    throw new Error("Failed to update user");
  }
};

// Deleting a user
export const deleteUser = async (id: string) => {
  try {
    await axiosClient.delete(`/users/${id}`);
  } catch (err) {
    console.error("Error deleting user:", err);
    throw new Error("Failed to delete user");
  }
};
