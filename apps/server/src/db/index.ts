import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

// Creating an ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database Typing
type DatabaseSchema = {
  users: Array<{
    id: string;
    name: string;
    email: string;
    password: string; 
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
  roles: Array<{
    id: string;
    name: string;
    permissions: string[];
  }>;
  permissions: Array<{
    id: string;
    name: string;
  }>;
  auditLogs: Array<{
    id: string;
    userId: string;
    action: string;
    targetId: string;
    timestamp: string;
  }>;
  refreshTokens: string[]; 
};

// Path to the database file
const dbFilePath = path.resolve(__dirname, "db.json");
const adapter = new JSONFile<DatabaseSchema>(dbFilePath);
const db = new Low(adapter);

export async function initDatabase() {
  console.log("Initializing database...");

  // Reading data from the database
  await db.read();

  // Setting the `db.data` object if it is not defined
  if (!db.data) {
    db.data = {
      users: [],
      roles: [],
      permissions: [],
      auditLogs: [],
      refreshTokens: []
    };
  }

  // Initialize the roles array if it does not exist
  if (!db.data.roles) {
    db.data.roles = [];
  }

  // Adding sample data for roles if they do not exist
  if (db.data.roles.length === 0) {
    db.data.roles = [
      { id: "role_user", name: "User", permissions: ["read"] },
      { id: "role_manager", name: "Manager", permissions: ["read", "create", "update"] },
      { id: "role_admin", name: "Administrator", permissions: ["read", "create", "update", "delete", "change_roles"] },
    ];
  }

  // Initialize the rights array if it does not exist
  if (!db.data.permissions) {
    db.data.permissions = [];
  }

  // Adding sample data for rights if they are not there
  if (db.data.permissions.length === 0) {
    db.data.permissions = [
      { id: "permission_read", name: "read" },
      { id: "permission_create", name: "create" },
      { id: "permission_update", name: "update" },
      { id: "permission_delete", name: "delete" },
      { id: "permission_change_roles", name: "change_roles" },
    ];
  }

  // Let's make sure that the other fields are also initialized.
  db.data.users ||= [];
  db.data.auditLogs ||= [];
  db.data.refreshTokens ||= [];

  // Writing data to a file
  await db.write();
  console.log("The database has been initialized.!");
}

export { db };


