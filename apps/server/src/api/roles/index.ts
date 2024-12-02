import { Router } from "express";
import { db } from "../../db/index.js";
import { z } from "zod"; // We use it for data validation

const router = Router();

// Scheme for role validation
const roleSchema = z.object({
  name: z.string(),
  permissions: z.array(z.string())
});

// Get all roles
router.get("/", async (req, res) => {
  await db.read();
  res.json(db.data?.roles || []);
});

// Get role by ID
router.get("/:id", async (req, res) => {
  await db.read();
  const role = db.data?.roles.find((r) => r.id === req.params.id);

  if (!role) {
    return res.status(404).json({ message: "Role not found" });
  }

  res.json(role);
});


// Create a new role
router.post("/", async (req, res) => {
    await db.read();
  
    try {
      // Checking data via Zod
      const validatedRole = roleSchema.parse(req.body);
  
      const newRole = {
        id: `role_${Date.now()}`,
        ...validatedRole
      };
  
      db.data?.roles.push(newRole);
      await db.write();
  
      res.status(201).json(newRole);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors });
      } else if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({ message: "Unknown error occurred" });
      }
    }
});
  

// Update role by ID
router.put("/:id", async (req, res) => {
    await db.read();
  
    const roleIndex = db.data?.roles.findIndex((r) => r.id === req.params.id);
  
    if (roleIndex === undefined || roleIndex === -1) {
      return res.status(404).json({ message: "Role not found" });
    }
  
    try {
      // Checking data via Zod
      const validatedRole = roleSchema.parse(req.body);
  
      db.data!.roles[roleIndex] = {
        ...db.data!.roles[roleIndex],
        ...validatedRole
      };
  
      await db.write();
  
      res.json(db.data!.roles[roleIndex]);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors });
      } else if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({ message: "Unknown error occurred" });
      }
    }
  });
  

// Delete role by ID
router.delete("/:id", async (req, res) => {
  await db.read();

  const roleIndex = db.data?.roles.findIndex((r) => r.id === req.params.id);

  if (roleIndex === undefined || roleIndex === -1) {
    return res.status(404).json({ message: "Role not found" });
  }

  db.data?.roles.splice(roleIndex, 1);
  await db.write();

  res.status(204).send();
});

export default router;
