import appointmentModel from "../models/appointmentModel.js";

// ================= CREATE APPOINTMENT =================
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    const appointment = await appointmentModel.create({
      userId: req.user.id,
      doctorId,
      date,
      time,
    });

    res.status(201).json({
      success: true,
      message: "Appointment Created Successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Create Appointment Error" });
  }
};

// ================= GET ALL APPOINTMENTS =================
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find()
      .populate("userId", "name email")
      .populate("doctorId", "name specialization");

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ message: "Fetch Error" });
  }
};

// ================= GET APPOINTMENT DETAILS =================
export const getAppointmentDetails = async (req, res) => {
  try {
    const appointment = await appointmentModel
      .findById(req.params.id)
      .populate("userId", "name email")
      .populate("doctorId", "name specialization");

    if (!appointment)
      return res.status(404).json({ message: "Appointment Not Found" });

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: "Details Fetch Error" });
  }
};

// ================= UPDATE STATUS =================
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await appointmentModel.findById(req.params.id);

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    // Check if this doctor owns this appointment
    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your appointment" });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      success: true,
      message: "Status Updated",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Update Error" });
  }
};

// ================= GET ALL USER APPOINTMENTS =================
export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({ userId: req.user.id })
      .populate("doctorId", "name specialization");

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ message: "User Fetch Error" });
  }
};

// ================= GET USER APPOINTMENT DETAILS =================
export const getUserAppointmentDetails = async (req, res) => {
  try {
    const appointment = await appointmentModel
      .findOne({
        _id: req.params.id,
        userId: req.user.id,
      })
      .populate("doctorId", "name specialization");

    if (!appointment)
      return res.status(404).json({ message: "Appointment Not Found" });

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: "User Details Error" });
  }
};