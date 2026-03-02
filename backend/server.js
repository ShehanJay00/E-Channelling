import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
// Import AI routes for symptom checker feature
import aiRoutes from "./routes/aiRoutes.js";


dotenv.config();

const app = express();

// DATABASE
mongoose
  .connect(`${process.env.MONGO_LOCAL_URL}/doctorapp`)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.log("MongoDB Error:", err.message);
    process.exit(1);
  });

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// STATIC IMAGE ACCESS
app.use("/uploads", express.static("uploads"));

// ROUTES
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/appointment", appointmentRoutes);
app.use("/api/v1/hospital", hospitalRoutes);
app.use("/api/v1/donation", donationRoutes);
// Mount AI symptom checker routes
app.use("/api/v1/ai", aiRoutes);

// Root route - server health check
app.get("/", (req, res) => {
  res.send("Smart E-Channeling Server Running");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});