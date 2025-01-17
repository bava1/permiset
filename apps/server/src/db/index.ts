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
    userImg: string;
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
      { id: "role_manager", name: "Manager", permissions: ["read", "create"] },
      { id: "role_admin", name: "Administrator", permissions: ["read", "create", "update", "delete", "change_roles"] },
    ];
  }

  if (db.data.users.length === 0) {
    console.log("Seeding initial users...");
    db.data.users = [
      {
        id: "user1",
        name: "Alex Grinberg",
        email: "a.grinberg@test.com",
        password: "$2b$10$7E2eJlqPL5FSlq1SukjIOu.LZEeteXeEWwwXx6La/PNGoopoNHQHW", 
        role: "Administrator",
        status: "active",
        userImg: "img1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "user2",
        name: "Martina Petrova",
        email: "m.petrova@test.com",
        password: "$2b$10$7E2eJlqPL5FSlq1SukjIOu.LZEeteXeEWwwXx6La/PNGoopoNHQHW", 
        role: "Manager",
        status: "inactive",
        userImg: "img2",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "user3",
        name: "Monika Berluskoni",
        email: "m.berluskoni@test.com",
        password: "$2b$10$7E2eJlqPL5FSlq1SukjIOu.LZEeteXeEWwwXx6La/PNGoopoNHQHW", 
        role: "User",
        status: "active",
        userImg: "img3",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "user4",
        name: "Tom Berenger",
        email: "t.berenger@test.com",
        password: "$2b$10$7E2eJlqPL5FSlq1SukjIOu.LZEeteXeEWwwXx6La/PNGoopoNHQHW", 
        role: "Manager",
        status: "active",
        userImg: "img4",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "user5",
        name: "Lidia Schevcenko",
        email: "l.schevcenko@test.com",
        password: "$2b$10$7E2eJlqPL5FSlq1SukjIOu.LZEeteXeEWwwXx6La/PNGoopoNHQHW", 
        role: "User",
        status: "active",
        userImg: "img5",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "user6",
        name: "Loretta Mileno-Amborsini",
        email: "l.mileno@test.com",
        password: "$2b$10$7E2eJlqPL5FSlq1SukjIOu.LZEeteXeEWwwXx6La/PNGoopoNHQHW", 
        role: "Administrator",
        status: "inactive",
        userImg: "img6",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "user7",
        name: "Natalia Kornisevskaja",
        email: "n.kornisevskaja@test.com",
        password: "$2b$10$7E2eJlqPL5FSlq1SukjIOu.LZEeteXeEWwwXx6La/PNGoopoNHQHW", 
        role: "User",
        status: "active",
        userImg: "img7",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "user8",
        name: "Pavel Novotny",
        email: "p.novotny@test.com",
        password: "$2b$10$7E2eJlqPL5FSlq1SukjIOu.LZEeteXeEWwwXx6La/PNGoopoNHQHW", 
        role: "Manager",
        status: "active",
        userImg: "img9",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "user9",
        name: "Kristina Asmusova",
        email: "k.asmus@test.com",
        password: "$2b$10$7E2eJlqPL5FSlq1SukjIOu.LZEeteXeEWwwXx6La/PNGoopoNHQHW", 
        role: "Administrator",
        status: "active",
        userImg: "img13",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "user10",
        name: "Mariend Cheng",
        email: "m.cheng@test.com",
        password: "$2b$10$7E2eJlqPL5FSlq1SukjIOu.LZEeteXeEWwwXx6La/PNGoopoNHQHW", 
        role: "User",
        status: "inactive",
        userImg: "img17",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
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


