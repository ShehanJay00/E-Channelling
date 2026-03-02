import express from "express";
import { createDonationController, getDonationsController } from "../controllers/donationController.js";

const router = express.Router();

router.post("/donate", createDonationController);
router.get("/recent", getDonationsController);

export default router;
