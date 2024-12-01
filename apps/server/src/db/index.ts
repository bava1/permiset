import { Low } from "lowdb";
import { JSONFile } from "lowdb/node"; // Исправленный импорт
import path from "path";

// Определение схемы базы данных
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

// Указываем путь к файлу базы данных
const dbFilePath = path.resolve(__dirname, "db/db.json");
const adapter = new JSONFile<DatabaseSchema>(dbFilePath);

// Передаём адаптер в Low
const db = new Low(adapter);

// Инициализация данных базы
async function initDatabase() {
  console.log("Инициализация базы данных...");

  // Чтение данных
  await db.read();

  // Установка данных по умолчанию, если база пуста
  if (!db.data) {
    db.data = {
      users: [],
      roles: [],
      permissions: [],
      auditLogs: [],
    };
  }

  console.log("Текущее состояние данных:", db.data);

  // Пример данных
  db.data.roles = [
    { id: "role_user", name: "User", permissions: ["read"] },
    { id: "role_manager", name: "Manager", permissions: ["read", "create", "update"] },
    { id: "role_admin", name: "Administrator", permissions: ["read", "create", "update", "delete", "change_roles"] },
  ];

  db.data.permissions = [
    { id: "permission_read", name: "read" },
    { id: "permission_create", name: "create" },
    { id: "permission_update", name: "update" },
    { id: "permission_delete", name: "delete" },
    { id: "permission_change_roles", name: "change_roles" },
  ];

  // Запись данных
  await db.write();
  console.log("Инициализация завершена!");
}

export { db, initDatabase };


