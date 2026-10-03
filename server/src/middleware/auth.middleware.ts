import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is missing from environment variables");
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "ADMIN" | "USER" | "OWNER";
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication token is required",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Authentication token is required",
    });
  }

  try {
    const payload = jwt.verify(token, secret);

    if (typeof payload === "string") {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    const role = payload.role;

    if (
      typeof payload.sub !== "string" ||
      !["ADMIN", "USER", "OWNER"].includes(role as string)
    ) {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    req.user = {
      id: payload.sub,
      role: role as "ADMIN" | "USER" | "OWNER",
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired authentication token",
    });
  }
};