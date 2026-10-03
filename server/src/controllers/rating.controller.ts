import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";

export const createRating = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const storeId =
      typeof req.params.storeId === "string" ? req.params.storeId : undefined;
    const { rating } = req.body;

    if (!storeId) {
      return res.status(400).json({
        message: "Store ID is required",
      });
    }

    if (
      typeof rating !== "number" ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5",
      });
    }

    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
      },
    });

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId: req.user.id,
          storeId,
        },
      },
    });

    if (existingRating) {
      return res.status(409).json({
        message: "You have already rated this store",
      });
    }

    const newRating = await prisma.rating.create({
      data: {
        rating,
        userId: req.user.id,
        storeId,
      },
    });

    return res.status(201).json({
      message: "Rating submitted successfully",
      rating: newRating,
    });
  } catch (error) {
    console.error("Create rating error:", error);

    return res.status(500).json({
      message: "Failed to submit rating",
    });
  }
};


export const updateRating = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const storeId =
      typeof req.params.storeId === "string"
        ? req.params.storeId
        : undefined;

    const { rating } = req.body;

    if (!storeId) {
      return res.status(400).json({
        message: "Store ID is required",
      });
    }

    if (
      typeof rating !== "number" ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5",
      });
    }

    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId: req.user.id,
          storeId,
        },
      },
    });

    if (!existingRating) {
      return res.status(404).json({
        message: "Rating not found",
      });
    }

    const updatedRating = await prisma.rating.update({
      where: {
        id: existingRating.id,
      },
      data: {
        rating,
      },
    });

    return res.status(200).json({
      message: "Rating updated successfully",
      rating: updatedRating,
    });
  } catch (error) {
    console.error("Update rating error:", error);

    return res.status(500).json({
      message: "Failed to update rating",
    });
  }
};

export const getOwnerStoreRatings = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const storeId =
      typeof req.params.storeId === "string"
        ? req.params.storeId
        : undefined;

    if (!storeId) {
      return res.status(400).json({
        message: "Store ID is required",
      });
    }

    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
      },
      select: {
        id: true,
        name: true,
        ownerId: true,
      },
    });

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    if (store.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "You do not own this store",
      });
    }

    const ratings = await prisma.rating.findMany({
      where: {
        storeId,
      },
      select: {
        id: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      store: {
        id: store.id,
        name: store.name,
      },
      ratings,
    });
  } catch (error) {
    console.error("Get owner store ratings error:", error);

    return res.status(500).json({
      message: "Failed to fetch store ratings",
    });
  }
};