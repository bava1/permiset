import express from "express";
import { initDatabase } from "./db/index.js";
import usersRouter from "./api/users/index.js";
import rolesRouter from "./api/roles/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { type: "json" };
import { authenticate } from "./middlewares/auth.js";
import authRouter from "./api/auth/index.js";
import { checkPermissions } from "./middlewares/checkPermissions.js";
import cors from "cors";

const app = express();
const PORT = 3000;

// Настройка CORS для взаимодействия с клиентом
app.use(
  cors({
    origin: "https://permiset-client-1.vercel.app", // Разрешаем клиенту обращаться к API
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

// Middleware для обработки JSON-тела запроса
app.use(express.json());

// Swagger-документация
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Инициализация базы данных
initDatabase().catch((err) => {
  console.error("Database initialization error:", err);
});

// Роут для корневого URL
app.get("/", (req, res) => {
  res.send("Welcome to the Permiset API! Use /users to manage users.");
});

// Подключение маршрутов с middleware аутентификации
app.use("/users", authenticate, usersRouter);
app.use("/roles", authenticate, rolesRouter);

// Пример с дополнительным middleware для проверки прав доступа
// app.use("/users", authenticate, checkPermissions(["read", "update"]), usersRouter);
// app.use("/roles", authenticate, checkPermissions(["manage_roles"]), rolesRouter);

app.use("/auth", authRouter);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
