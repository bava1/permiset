import { Request, Response, NextFunction } from "express";
import { db } from "../db/index.js";

export const checkPermissions = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await db.read();
    const userRole = (req as any).user?.role;
    const role = db.data?.roles.find((r) => r.id === userRole);

    if (!role || !role.permissions.some((p) => requiredPermissions.includes(p))) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }

    next();
  };
};
