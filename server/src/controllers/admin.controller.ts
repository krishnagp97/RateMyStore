
import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";

export const getAdminDashboard = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const [totalUsers, totalStores, totalRatings] =
      await Promise.all([
        prisma.user.count(),
        prisma.store.count(),
        prisma.rating.count(),
      ]);

    return res.status(200).json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      message: "Failed to fetch dashboard statistics",
    });
  }
};


export const getUsers = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const search = {
      name:
        typeof req.query.name === "string"
          ? req.query.name.trim()
          : "",
      email:
        typeof req.query.email === "string"
          ? req.query.email.trim()
          : "",
      address:
        typeof req.query.address === "string"
          ? req.query.address.trim()
          : "",
      role:
        typeof req.query.role === "string"
          ? req.query.role.trim().toUpperCase()
          : "",
    };

    const validRoles = ["ADMIN", "USER", "OWNER"];

    if (search.role && !validRoles.includes(search.role)) {
      return res.status(400).json({
        message: "Role must be ADMIN, USER, or OWNER",
      });
    }

    const users = await prisma.user.findMany({
      where: {
        ...(search.name
          ? {
              name: {
                contains: search.name,
                mode: "insensitive",
              },
            }
          : {}),
        ...(search.email
          ? {
              email: {
                contains: search.email,
                mode: "insensitive",
              },
            }
          : {}),
        ...(search.address
          ? {
              address: {
                contains: search.address,
                mode: "insensitive",
              },
            }
          : {}),
        ...(search.role
          ? {
              role: search.role as "ADMIN" | "USER" | "OWNER",
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Admin get users error:", error);

    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};
