import express from "express";
import {
  registerController,
  loginController,
  getUserController,
  updateUserController,
  getAdminStats,
} from "../controllers/userController.js";
import { requireSignIn, requireAdmin } from "../middlewares/authMiddleware.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/get-user", requireSignIn, getUserController);
router.patch(
  "/update-profile",
  requireSignIn,
  upload.single("image"),
  updateUserController
);

// Admin routes
router.get("/admin/stats", requireSignIn, requireAdmin, getAdminStats);
router.get("/admin/all-users", requireSignIn, requireAdmin, getUserController);

export default router;