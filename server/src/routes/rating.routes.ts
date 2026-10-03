import { Router } from "express";
import { createRating, updateRating } from "../controllers/rating.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.post(
  "/:storeId",
  authenticate,
  authorize("USER"),
  createRating,
);

router.put(
  "/:storeId",
  authenticate,
  authorize("USER"),
  updateRating,
);

export default router;