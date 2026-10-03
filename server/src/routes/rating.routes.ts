import { Router } from "express";
import {
  createRating,
  updateRating,
  getOwnerStoreRatings,
} from "../controllers/rating.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.post("/:storeId", authenticate, authorize("USER"), createRating);

router.put("/:storeId", authenticate, authorize("USER"), updateRating);

router.get(
  "/:storeId/ratings",
  authenticate,
  authorize("OWNER"),
  getOwnerStoreRatings,
);

export default router;
