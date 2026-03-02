import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentDetails,
  updateAppointmentStatus,
  getUserAppointments,
  getUserAppointmentDetails,
} from "../controllers/appointmentController.js";

import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// CREATE
router.post("/create", requireSignIn, createAppointment);

// GET ALL
router.get("/all", getAllAppointments);

// GET DETAILS
router.get("/details/:id", getAppointmentDetails);

// UPDATE STATUS
router.put("/update/:id", updateAppointmentStatus);

// GET USER APPOINTMENTS
router.get("/user/all", requireSignIn, getUserAppointments);

// GET USER APPOINTMENT DETAILS
router.get("/user/details/:id", requireSignIn, getUserAppointmentDetails);

export default router;