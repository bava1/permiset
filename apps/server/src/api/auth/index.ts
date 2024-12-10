import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from "../../db/index.js";

const router = Router();

// Constants for JWT
const JWT_SECRET = "supersecretkey"; // It is recommended to store in .env
const JWT_EXPIRES_IN = "1h";


// POST /auth/login - User authorization
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  await db.read();
  const user = db.data?.users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Checking the password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Let's create an access token (short-lived)
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN, 
  });

  // Let's create a refresh token (long-lived)
  const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: "7d", 
  });

  // Save refresh token to the database (optional for added security)
  db.data?.refreshTokens.push(refreshToken);
  await db.write();

  // Возвращаем данные пользователя без пароля
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    token, // Access token
    refreshToken,
    user: userWithoutPassword, // Информация о пользователе
  });
});


// POST /auth/logout - Logout user
router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  // Reading the database
  await db.read();

  // We check if there is such a refreshToken in the database
  const tokenIndex = db.data?.refreshTokens.findIndex((token) => token === refreshToken);

  if (tokenIndex === undefined || tokenIndex === -1) {
    return res.status(400).json({ message: "Invalid refresh token" });
  }

  // Удаляем refreshToken
  db.data?.refreshTokens.splice(tokenIndex, 1);
  await db.write();

  res.status(200).json({ message: "Successfully logged out" });
});


// GET /auth/verify - Token verification (for tests)
router.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, decoded });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// POST /auth/register - New User Registration
router.post("/register", async (req, res) => {
  const { name, email, password, role = "User", status = "active" } = req.body;

  await db.read();

  // Проверка на уникальность email
  const existingUser = db.data?.users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User with this email already exists" });
  }

  // Создание нового пользователя
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.data?.users.push(newUser);
  await db.write();

  res.status(201).json(newUser);
});


// POST /auth/refresh - Token refresh
router.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }
  
    await db.read();
    if (!db.data?.refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
  
    try {
      const payload = jwt.verify(refreshToken, JWT_SECRET);
      const newAccessToken = jwt.sign(
        { id: (payload as any).id, role: (payload as any).role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
  
      res.json({ token: newAccessToken });
    } catch (err) {
      res.status(403).json({ message: "Invalid refresh token" });
    }
});
  
export default router;
