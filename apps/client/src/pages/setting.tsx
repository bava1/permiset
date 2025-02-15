import React, { useState, useEffect } from "react";
import { fetchRoles, updateRole } from "../api/roles";
import {
  Box,
  Typography,
  List,
  ListItem,
  Button,
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const Settings: React.FC = () => {
  const [roles, setRoles] = useState<any[]>([]); 
  const [editedRoles, setEditedRoles] = useState<Record<string, string[]>>({}); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const permissions:string[] = ["read", "create", "update", "delete", "change_roles"];
  const { t } = useTranslation("common");
  useEffect(() => {
    // Loading roles when mounting a component
    const loadRoles = async () => {
      try {
        setLoading(true);
        const rolesData = await fetchRoles();
        setRoles(rolesData);
        // Initialize the local editing state
        const initialEditedRoles = rolesData.reduce(
          (acc: Record<string, string[]>, role: any) => ({
            ...acc,
            [role.id]: role.permissions,
          }),
          {}
        );
        setEditedRoles(initialEditedRoles);
      } catch (err: any) {
        setError(err.message || "Failed to load roles.");
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, []);

  const handleCheckboxChange = (roleId: string, permission: string, checked: boolean) => {
    setEditedRoles((prev) => {
      const updatedPermissions = checked
        ? [...prev[roleId], permission]
        : prev[roleId].filter((p) => p !== permission);

      // We guarantee that at least one resolution will remain
      if (updatedPermissions.length === 0) {
        return prev; // If you try to delete the last permission, do not change anything
      }

      return { ...prev, [roleId]: updatedPermissions };
    });
  };

  const handleSaveRole = async (roleId: string) => {
    try {
      const updatedPermissions = editedRoles[roleId];
      const roleName = roles.find((role) => role.id === roleId)?.name || "";

      await updateRole(roleId, { name: roleName, permissions: updatedPermissions });

      setRoles((prevRoles) =>
        prevRoles.map((role) =>
          role.id === roleId ? { ...role, permissions: updatedPermissions } : role
        )
      );

      alert("Role updated successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to update role.");
    }
  };

  if (loading) {
    return <Typography>Loading roles...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <h1>{t("settings")}</h1>
      <List>
        {roles.map((role) => (
          <ListItem key={role.id} sx={{ mb: 2 }}>
            <Box sx={{ width: "100%" }}>
              <Typography variant="h6" gutterBottom>
                {role.name}
              </Typography>
              <FormControl component="fieldset">
                <FormGroup>
                  {permissions.map((permission) => (
                    <FormControlLabel
                      key={permission}
                      control={
                        <Checkbox
                          checked={editedRoles[role.id]?.includes(permission) || false}
                          onChange={(e) =>
                            handleCheckboxChange(role.id, permission, e.target.checked)
                          }
                        />
                      }
                      label={permission}
                    />
                  ))}
                </FormGroup>
              </FormControl>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSaveRole(role.id)}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Settings;
