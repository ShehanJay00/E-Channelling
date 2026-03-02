import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import hospitalModel from "../models/hospitalModel.js";


// ================= REGISTER =================
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Register Error" });
  }
};

// ================= LOGIN =================
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = JWT.sign(
      { id: user._id, role: user.role },   // 🔥 role included in token
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.password = undefined;

    res.json({
      success: true,
      message: "Login Success",
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({ message: "Login Error" });
  }
};



// ================= GET ALL USERS =================
export const getUserController = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Fetch Users Error" });
  }
};



// ================= UPDATE PROFILE =================
export const updateUserController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, phone } = req.body;

    const updated = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        name: name || user.name,
        email: email || user.email,
        phone: phone || user.phone,
        profilePic: req.file ? req.file.filename : user.profilePic,
      },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile Updated",
      user: updated,
    });

  } catch (error) {
    res.status(500).json({ message: "Update Error" });
  }
};



// ================= ADMIN DASHBOARD STATS =================
export const getAdminStats = async (req, res) => {
  try {
    const totalDoctors = await doctorModel.countDocuments();
    const totalUsers = await userModel.countDocuments({ role: "user" });
    const totalAppointments = await appointmentModel.countDocuments();
    const totalHospitals = await hospitalModel.countDocuments();
    const pendingAppointments = await appointmentModel.countDocuments({ status: "pending" });

    // Get latest 5 appointments for dashboard
    const latestAppointments = await appointmentModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name")
      .populate("doctorId", "name specialization");

    res.json({
      success: true,
      stats: {
        totalDoctors,
        totalUsers,
        totalAppointments,
        totalHospitals,
        pendingAppointments,
      },
      latestAppointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Stats Error" });
  }
};