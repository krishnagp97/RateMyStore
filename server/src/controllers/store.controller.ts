import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";

export const createStore = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { name, email, address } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({
        message: "Name, email and address are required",
      });
    }

    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId: req.user.id,
      },
    });

    return res.status(201).json({
      message: "Store created successfully",
      store,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create store",
    });
  }
};

export const getStores = async (req: AuthRequest, res: Response) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const stores = await prisma.store.findMany({
      ...(search
        ? {
            where: {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  address: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            },
          }
        : {}),
      include: {
        ratings: {
          select: {
            rating: true,
            userId: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const formattedStores = stores.map((store) => {
      const totalRatings = store.ratings.length;
      const userRating =
        store.ratings.find((item) => item.userId === req.user?.id)?.rating ??
        null;

      const overallRating =
        totalRatings === 0
          ? 0
          : store.ratings.reduce((sum, item) => sum + item.rating, 0) /
            totalRatings;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        overallRating: Number(overallRating.toFixed(1)),
        userRating,
      };
    });

    return res.status(200).json({
      stores: formattedStores,
    });
  } catch (error) {
    console.error("Get stores error:", error);

    return res.status(500).json({
      message: "Failed to fetch stores",
    });
  }
};
