
import { Router } from "express";
import {
  getAdminDashboard,
  getUsers,
} from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/dashboard", getAdminDashboard);
router.get("/users", getUsers);

export default router;
