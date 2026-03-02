    // ============================================================
    // SEED SCRIPT — Populates the database with sample hospitals
    // and doctors so the frontend can display data before the
    // admin panel is built.
    //
    // Usage:  node seedData.js
    //
    // This script:
    //  1. Connects to MongoDB (same connection string as backend)
    //  2. Clears existing hospitals & doctors (to avoid duplicates)
    //  3. Creates a placeholder "doctor" user account
    //  4. Inserts 6 hospitals
    //  5. Inserts 10 doctors (isApproved: true so they appear)
    //  6. Disconnects and exits
    // ============================================================

    import mongoose from "mongoose";
    import dotenv from "dotenv";
    import bcrypt from "bcryptjs";

    // Load env vars (MONGO_LOCAL_URL lives in .env)
    dotenv.config();

    // --- Import models ---
    import hospitalModel from "./models/hospitalModel.js";
    import doctorModel from "./models/doctorModel.js";
    import userModel from "./models/userModel.js";

    // ===================== SAMPLE DATA =====================

    // 6 Sri Lankan hospitals with realistic details
    const hospitals = [
    {
        name: "Asiri Hospital Colombo",
        location: "Colombo 05",
        rating: 4.8,
        image: "", // no uploaded image — frontend will use default
    },
    {
        name: "Lanka Hospitals",
        location: "Colombo 05",
        rating: 4.7,
        image: "",
    },
    {
        name: "Nawaloka Hospital",
        location: "Colombo 02",
        rating: 4.6,
        image: "",
    },
    {
        name: "Durdans Hospital",
        location: "Colombo 03",
        rating: 4.5,
        image: "",
    },
    {
        name: "Hemas Hospital Wattala",
        location: "Wattala",
        rating: 4.4,
        image: "",
    },
    {
        name: "Teaching Hospital Kandy",
        location: "Kandy",
        rating: 4.3,
        image: "",
    },
    ];

    // 10 doctors spread across the hospitals above
    // Each doctor needs a userId — we create placeholder users below
    const doctorProfiles = [
    {
        name: "Dr. Amanda Silva",
        specialization: "Cardiologist",
        experience: "12 Years",
        hospital: "Asiri Hospital Colombo",
        fee: 3500,
        availableDays: ["Monday", "Wednesday", "Friday"],
    },
    {
        name: "Dr. Nimal Perera",
        specialization: "Neurologist",
        experience: "10 Years",
        hospital: "Asiri Hospital Colombo",
        fee: 3000,
        availableDays: ["Tuesday", "Thursday", "Saturday"],
    },
    {
        name: "Dr. Kavinda Jayasuriya",
        specialization: "Orthopedic Surgeon",
        experience: "15 Years",
        hospital: "Lanka Hospitals",
        fee: 4000,
        availableDays: ["Monday", "Tuesday", "Friday"],
    },
    {
        name: "Dr. Tharushi Fernando",
        specialization: "Dermatologist",
        experience: "8 Years",
        hospital: "Lanka Hospitals",
        fee: 2500,
        availableDays: ["Wednesday", "Thursday", "Saturday"],
    },
    {
        name: "Dr. Ruwan Wijesinghe",
        specialization: "General Physician",
        experience: "20 Years",
        hospital: "Nawaloka Hospital",
        fee: 2000,
        availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
    },
    {
        name: "Dr. Sachini Abeywardena",
        specialization: "Pediatrician",
        experience: "9 Years",
        hospital: "Nawaloka Hospital",
        fee: 2800,
        availableDays: ["Tuesday", "Thursday"],
    },
    {
        name: "Dr. Chaminda Ratnayake",
        specialization: "ENT Specialist",
        experience: "14 Years",
        hospital: "Durdans Hospital",
        fee: 3200,
        availableDays: ["Monday", "Wednesday", "Saturday"],
    },
    {
        name: "Dr. Imalka Senanayake",
        specialization: "Gynecologist",
        experience: "11 Years",
        hospital: "Durdans Hospital",
        fee: 3500,
        availableDays: ["Tuesday", "Friday"],
    },
    {
        name: "Dr. Dinesh Samaraweera",
        specialization: "Psychiatrist",
        experience: "7 Years",
        hospital: "Hemas Hospital Wattala",
        fee: 2500,
        availableDays: ["Monday", "Thursday", "Saturday"],
    },
    {
        name: "Dr. Lakmal Gunawardena",
        specialization: "Urologist",
        experience: "16 Years",
        hospital: "Teaching Hospital Kandy",
        fee: 3000,
        availableDays: ["Wednesday", "Friday", "Saturday"],
    },
    ];

    // ===================== SEED FUNCTION =====================

    const seedDatabase = async () => {
    try {
        // 1️⃣ Connect to MongoDB (uses the same MONGO_LOCAL_URL from .env)
        await mongoose.connect(`${process.env.MONGO_LOCAL_URL}/doctorapp`);
        console.log("✅ Connected to MongoDB");

        // 2️⃣ Clear old seed data to avoid duplicates on re-runs
        await hospitalModel.deleteMany({});
        console.log("🗑️  Cleared existing hospitals");

        await doctorModel.deleteMany({});
        console.log("🗑️  Cleared existing doctors");

        // 3️⃣ Insert hospitals
        const insertedHospitals = await hospitalModel.insertMany(hospitals);
        console.log(`🏥 Inserted ${insertedHospitals.length} hospitals`);

        // 4️⃣ Create placeholder user accounts for each doctor
        //    (Doctor model requires a userId reference)
        const hashedPassword = await bcrypt.hash("doctor123", 10);

        const doctorDocs = [];
        for (let i = 0; i < doctorProfiles.length; i++) {
        const profile = doctorProfiles[i];

        // Create a unique email from doctor name (lowercase, no spaces/dots)
        const email = profile.name
            .toLowerCase()
            .replace(/dr\.\s?/, "")
            .replace(/\s+/g, ".")
            .trim() + "@echanneling.lk";

        // Check if user already exists (from a previous run)
        let user = await userModel.findOne({ email });

        if (!user) {
            user = await userModel.create({
            name: profile.name,
            email,
            password: hashedPassword,
            phone: `07${String(10000000 + i).slice(-8)}`, // unique phone
            role: "doctor",
            });
        }

        // Build the doctor document
        doctorDocs.push({
            userId: user._id,
            name: profile.name,
            specialization: profile.specialization,
            experience: profile.experience,
            hospital: profile.hospital,
            fee: profile.fee,
            availableDays: profile.availableDays,
            image: "",            // no image — frontend uses default fallback
            isApproved: true,     // ✅ IMPORTANT — frontend only shows approved doctors
        });
        }

        // 5️⃣ Insert all doctors at once
        const insertedDoctors = await doctorModel.insertMany(doctorDocs);
        console.log(`👨‍⚕️ Inserted ${insertedDoctors.length} doctors (all approved)`);

        // 6️⃣ Summary
        console.log("\n========== SEED COMPLETE ==========");
        console.log(`Hospitals : ${insertedHospitals.length}`);
        console.log(`Doctors   : ${insertedDoctors.length}`);
        console.log("===================================\n");

        // Disconnect
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seed Error:", error.message);
        process.exit(1);
    }
    };

    // Run the seed function
    seedDatabase();
