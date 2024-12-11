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
export const createUser = async (user: { name: string; email: string; password: string; role: string; status: string }) => {
  try {
    const response = await axiosClient.post("/users", user);
    return response.data;
  } catch (err: any) {
    // Checking errors sent from the server
    if (err.response?.status === 400 && err.response.data?.message) {
      throw new Error(err.response.data.message); 
    } else if (err.response?.status === 401) {
      throw new Error("Unauthorized access. Please login again.");
    } else {
      console.error("Error creating user:", err);
      throw new Error("Failed to create user. Please check the provided data.");
    }
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
