import express from "express";
import {
  createDoctor,
  getAllDoctors,
  getSingleDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import upload from "../config/multer.js";

const router = express.Router();

// CREATE
router.post(
  "/create",
  requireSignIn,
  upload.single("image"),
  createDoctor
);

// GET ALL
router.get("/all", getAllDoctors);



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
router.delete("/delete/:id", requireSignIn, deleteDoctor);

export default router;