import { Router } from "express";
import { db } from "../../db/index.js";

const router = Router();

// Get all users
router.get("/", async (req, res) => {
  await db.read();
  res.json(db.data?.users || []);
});

// Get user by ID
router.get("/:id", async (req, res) => {
  await db.read();
  const user = db.data?.users.find((u) => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

// Create a new user
router.post("/", async (req, res) => {
  await db.read();
  const newUser = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.data?.users.push(newUser);
  await db.write();

  res.status(201).json(newUser);
});

// Update user by ID
router.put("/:id", async (req, res) => {
  await db.read();

  const userIndex = db.data?.users.findIndex((u) => u.id === req.params.id);

  if (userIndex === undefined || userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const updatedUser = {
    ...db.data!.users[userIndex],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  db.data!.users[userIndex] = updatedUser;

  // Проверяем запись в базу данных
  try {
    await db.write();
    res.json(updatedUser);
  } catch (err) {
    console.error("Failed to write to the database:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete user by ID
router.delete("/:id", async (req, res) => {
  await db.read();

  const userIndex = db.data?.users.findIndex((u) => u.id === req.params.id);

  if (userIndex === undefined || userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  db.data!.users.splice(userIndex, 1);

  try {
    await db.write();
    res.status(204).send();
  } catch (err) {
    console.error("Failed to write to the database:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
