import express from "express";
import { initDatabase } from "./db/index.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// Инициализация базы данных
initDatabase().catch((err) => {
  console.error("Ошибка инициализации базы данных:", err);
});

app.get("/", (req, res) => {
  res.send("Permiset Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
