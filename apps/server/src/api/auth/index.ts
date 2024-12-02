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
  const { name, password } = req.body;

  // Check if the user exists
  await db.read();
  const user = db.data?.users.find((u) => u.name === name);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Checking the password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Let's create a token
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.json({ token });
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
    const { name, email, password, role, status } = req.body;
  
    await db.read();
  
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: await bcrypt.hash(password, 10), // Hashing the password
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
