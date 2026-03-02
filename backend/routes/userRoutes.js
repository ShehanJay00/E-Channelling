import express from "express";
import {
  registerController,
  loginController,
  getUserController,
  updateUserController,
} from "../controllers/userController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
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

export default router;