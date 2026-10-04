
import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

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


export const createUser = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { name, email, address, password, role } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof address !== "string" ||
      typeof password !== "string" ||
      typeof role !== "string"
    ) {
      return res.status(400).json({
        message: "Name, email, address, password, and role are required",
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedAddress = address.trim();
    const normalizedRole = role.trim().toUpperCase();

    if (normalizedName.length < 20 || normalizedName.length > 60) {
      return res.status(400).json({
        message: "Name must be between 20 and 60 characters",
      });
    }

    if (normalizedAddress.length > 400) {
      return res.status(400).json({
        message: "Address must not exceed 400 characters",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordPattern.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8–16 characters and include an uppercase letter and a special character",
      });
    }

    if (!["ADMIN", "USER", "OWNER"].includes(normalizedRole)) {
      return res.status(400).json({
        message: "Role must be ADMIN, USER, or OWNER",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        address: normalizedAddress,
        password: hashedPassword,
        role: normalizedRole as "ADMIN" | "USER" | "OWNER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Admin create user error:", error);

    return res.status(500).json({
      message: "Failed to create user",
    });
  }
};



export const getAdminStores = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const name =
      typeof req.query.name === "string"
        ? req.query.name.trim()
        : "";

    const email =
      typeof req.query.email === "string"
        ? req.query.email.trim()
        : "";

    const address =
      typeof req.query.address === "string"
        ? req.query.address.trim()
        : "";

    const stores = await prisma.store.findMany({
      where: {
        ...(name
          ? {
              name: {
                contains: name,
                mode: "insensitive",
              },
            }
          : {}),
        ...(email
          ? {
              email: {
                contains: email,
                mode: "insensitive",
              },
            }
          : {}),
        ...(address
          ? {
              address: {
                contains: address,
                mode: "insensitive",
              },
            }
          : {}),
      },
      include: {
        ratings: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const formattedStores = stores.map((store) => {
      const totalRatings = store.ratings.length;

      const overallRating =
        totalRatings === 0
          ? 0
          : store.ratings.reduce(
              (sum, item) => sum + item.rating,
              0,
            ) / totalRatings;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        overallRating: Number(overallRating.toFixed(1)),
      };
    });

    return res.status(200).json({
      stores: formattedStores,
    });
  } catch (error) {
    console.error("Admin get stores error:", error);

    return res.status(500).json({
      message: "Failed to fetch stores",
    });
  }
};

export const createAdminStore = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof address !== "string" ||
      typeof ownerId !== "string"
    ) {
      return res.status(400).json({
        message: "Name, email, address, and owner ID are required",
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedAddress = address.trim();
    const normalizedOwnerId = ownerId.trim();

    if (normalizedName.length < 20 || normalizedName.length > 60) {
      return res.status(400).json({
        message: "Name must be between 20 and 60 characters",
      });
    }

    if (!normalizedAddress || normalizedAddress.length > 400) {
      return res.status(400).json({
        message: "Address must be between 1 and 400 characters",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    const owner = await prisma.user.findUnique({
      where: { id: normalizedOwnerId },
      select: { id: true, role: true },
    });

    if (!owner) {
      return res.status(404).json({
        message: "Owner not found",
      });
    }

    if (owner.role !== "OWNER") {
      return res.status(400).json({
        message: "Selected user is not a store owner",
      });
    }

    const existingStore = await prisma.store.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingStore) {
      return res.status(409).json({
        message: "A store with this email already exists",
      });
    }

    const store = await prisma.store.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        address: normalizedAddress,
        ownerId: normalizedOwnerId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        ownerId: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "Store created successfully",
      store,
    });
  } catch (error) {
    console.error("Admin create store error:", error);

    return res.status(500).json({
      message: "Failed to create store",
    });
  }
};


export const getUserDetails = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId =
      typeof req.params.userId === "string"
        ? req.params.userId
        : undefined;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        stores: {
          select: {
            id: true,
            name: true,
            ratings: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const stores = user.stores.map((store) => {
      const totalRatings = store.ratings.length;

      const averageRating =
        totalRatings === 0
          ? 0
          : store.ratings.reduce(
              (sum, item) => sum + item.rating,
              0,
            ) / totalRatings;

      return {
        id: store.id,
        name: store.name,
        totalRatings,
        averageRating: Number(averageRating.toFixed(1)),
      };
    });

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        ...(user.role === "OWNER" ? { stores } : {}),
      },
    });
  } catch (error) {
    console.error("Admin get user details error:", error);

    return res.status(500).json({
      message: "Failed to fetch user details",
    });
  }
};




