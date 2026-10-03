import { Router } from "express";
import { createStore, getStores } from "../controllers/store.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get("/", authenticate, authorize("USER", "OWNER", "ADMIN"), getStores);
router.post("/", authenticate, authorize("OWNER"), createStore);

export default router;
