import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

// Создание эквивалента __dirname для ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Типизация базы данных
type DatabaseSchema = {
  users: Array<{
    id: string;
    name: string;
    email: string;
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
};

// Путь к файлу базы данных
const dbFilePath = path.resolve(__dirname, "db.json");
const adapter = new JSONFile<DatabaseSchema>(dbFilePath);
const db = new Low(adapter);

export async function initDatabase() {
  console.log("Инициализация базы данных...");

  // Чтение данных из базы
  await db.read();

  // Установка объекта `db.data`, если он не определён
  if (!db.data) {
    db.data = {
      users: [],
      roles: [],
      permissions: [],
      auditLogs: [],
    };
  }

  // Инициализация массива ролей, если он не существует
  if (!db.data.roles) {
    db.data.roles = [];
  }

  // Добавление примерных данных для ролей, если их нет
  if (db.data.roles.length === 0) {
    db.data.roles = [
      { id: "role_user", name: "User", permissions: ["read"] },
      { id: "role_manager", name: "Manager", permissions: ["read", "create", "update"] },
      { id: "role_admin", name: "Administrator", permissions: ["read", "create", "update", "delete", "change_roles"] },
    ];
  }

  // Инициализация массива прав, если он не существует
  if (!db.data.permissions) {
    db.data.permissions = [];
  }

  // Добавление примерных данных для прав, если их нет
  if (db.data.permissions.length === 0) {
    db.data.permissions = [
      { id: "permission_read", name: "read" },
      { id: "permission_create", name: "create" },
      { id: "permission_update", name: "update" },
      { id: "permission_delete", name: "delete" },
      { id: "permission_change_roles", name: "change_roles" },
    ];
  }

  // Убедимся, что остальные поля тоже инициализированы
  db.data.users ||= [];
  db.data.auditLogs ||= [];

  // Запись данных в файл
  await db.write();
  console.log("База данных инициализирована!");
}

export { db };


