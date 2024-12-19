import axiosClient from "./axiosClient";

// Updating a role (adding or removing permissions)
export const updateRole = async (roleId: string, updatedData: { name: string; permissions: string[] }) => {
  try {
    const response = await axiosClient.put(`/roles/${roleId}`, updatedData);
    return response.data; // Returning the updated role
  } catch (err: any) {
    console.error("Failed to update role:", err);
    throw new Error(err.response?.data?.message || "Failed to update role.");
  }
};

// Getting a list of all roles
export const fetchRoles = async () => {
  try {
    const response = await axiosClient.get("/roles");
    return response.data; // Returning the list of roles
  } catch (err: any) {
    console.error("Failed to fetch roles:", err);
    throw new Error(err.response?.data?.message || "Failed to fetch roles.");
  }
};

// Getting a role by ID
export const fetchRoleById = async (roleId: string) => {
  try {
    const response = await axiosClient.get(`/roles/${roleId}`);
    return response.data; // Returning role data
  } catch (err: any) {
    console.error("Failed to fetch role:", err);
    throw new Error(err.response?.data?.message || "Failed to fetch role.");
  }
};
