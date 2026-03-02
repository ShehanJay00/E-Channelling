import hospitalModel from "../models/hospitalModel.js";

export const getHospitalsController = async (req, res) => {
    try {
        const hospitals = await hospitalModel.find({});
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hospitals" });
    }
};

export const createHospitalController = async (req, res) => {
    try {
        const { name, location, rating, image } = req.body;
        const newHospital = await hospitalModel.create({
            name,
            location,
            rating,
            image,
        });
        res.status(201).json({ message: "Hospital added", hospital: newHospital });
    } catch (error) {
        res.status(500).json({ message: "Error adding hospital" });
    }
};
