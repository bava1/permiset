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

app.use(cors({
  origin: "http://localhost:3001", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Authorization", "Content-Type"],
}));
const PORT = 3000;

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Initializing the database
initDatabase().catch((err) => {
  console.error("Database initialization error:", err);
});

// Route for root URL
app.get("/", (req, res) => {
  res.send("Welcome to the Permiset API! Use /users to manage users.");
});

// Connecting routes
app.use("/users", authenticate, usersRouter);
app.use("/roles", authenticate, rolesRouter);
// app.use("/users", authenticate, checkPermissions(["read", "update"]), usersRouter);
// app.use("/roles", authenticate, checkPermissions(["manage_roles"]), rolesRouter);
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



