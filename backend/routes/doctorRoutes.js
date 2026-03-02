import express from "express";
import {
  createDoctor,
  getAllDoctors,
  getSingleDoctor,
  updateDoctor,
  deleteDoctor,
  getAllDoctorsAdmin,
  approveDoctorController,
} from "../controllers/doctorController.js";
import { requireSignIn, requireAdmin } from "../middlewares/authMiddleware.js";
import upload from "../config/multer.js";

const router = express.Router();

// CREATE
router.post(
  "/create",
  requireSignIn,
  upload.single("image"),
  createDoctor
);

// GET ALL (approved only — for frontend)
router.get("/all", getAllDoctors);

// GET ALL (admin — including unapproved)
router.get("/admin/all", requireSignIn, requireAdmin, getAllDoctorsAdmin);

// APPROVE / REJECT
router.put("/approve/:id", requireSignIn, requireAdmin, approveDoctorController);

// GET SINGLE
router.get("/:id", getSingleDoctor);

// UPDATE
router.put(
  "/update/:id",
  requireSignIn,
  upload.single("image"),
  updateDoctor
);

// DELETE
router.delete("/delete/:id", requireSignIn, requireAdmin, deleteDoctor);

export default router;