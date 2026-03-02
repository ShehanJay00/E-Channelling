import express from "express";
import { getHospitalsController, createHospitalController } from "../controllers/hospitalController.js";

const router = express.Router();

router.get("/get-all", getHospitalsController);
router.post("/add", createHospitalController);

export default router;
