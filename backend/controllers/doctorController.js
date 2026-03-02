import doctorModel from "../models/doctorModel.js";

// CREATE DOCTOR
export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      specialization,
      experience,
      hospital,
      fee,
      availableDays,
    } = req.body;

    const doctor = await doctorModel.create({
      userId: req.user.id,
      name,
      specialization,
      experience,
      hospital,
      fee,
      availableDays: availableDays ? JSON.parse(availableDays) : [],
      image: req.file ? req.file.filename : "",
    });

    res.status(201).json({ message: "Doctor Created", doctor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Create Doctor Error" });
  }
};

// GET ALL DOCTORS
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel
      .find({ isApproved: true })   // 👈 ONLY APPROVED
      .populate("userId", "name email phone");

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Get Doctors Error" });
  }
  
};

// GET SINGLE DOCTOR
export const getSingleDoctor = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.params.id);
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Get Doctor Error" });
  }
};

// UPDATE DOCTOR
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        availableDays: req.body.availableDays
          ? JSON.parse(req.body.availableDays)
          : doctor.availableDays,
        image: req.file ? req.file.filename : doctor.image,
      },
      { new: true }
    );

    res.json({ message: "Doctor Updated", updatedDoctor });
  } catch (error) {
    res.status(500).json({ message: "Update Doctor Error" });
  }
};

// DELETE DOCTOR
export const deleteDoctor = async (req, res) => {
  try {
    await doctorModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Doctor Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete Doctor Error" });
  }
};