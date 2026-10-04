import { Router } from "express";
import {
  getAdminDashboard,
  getUsers,
  createUser,
  getAdminStores,
  createAdminStore,
  getUserDetails,
} from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/dashboard", getAdminDashboard);
router.get("/users", getUsers);
router.post("/users", createUser);
router.get("/stores", getAdminStores);
router.post("/stores", createAdminStore);
router.get("/users/:userId", getUserDetails);

export default router;
