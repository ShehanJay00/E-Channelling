import donationModel from "../models/donationModel.js";

export const createDonationController = async (req, res) => {
    try {
        const { name, amount, paymentMethod } = req.body;
        const donation = await donationModel.create({
            name: name || "Anonymous",
            amount,
            paymentMethod,
            status: "completed", // Mocking completion immediately for now
        });

        res.status(201).json({ message: "Donation successful", donation });
    } catch (error) {
        res.status(500).json({ message: "Error processing donation" });
    }
};

export const getDonationsController = async (req, res) => {
    try {
        const donations = await donationModel.find({}).sort({ createdAt: -1 }).limit(10);
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching donations" });
    }
};
