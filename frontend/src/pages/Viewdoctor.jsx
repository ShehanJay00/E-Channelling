import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Hospital";
import doctorImg from "../assets/doctor.jpg";
// Import doctor API service to fetch data from backend
import doctorService from "../api/doctorService";

function Doctors() {
  const navigate = useNavigate();
  const location = useLocation();
  // Get hospital name passed from Hospital page (optional filter)
  const hospitalFilter = location.state?.hospital || "";

  // State for doctors fetched from backend
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all approved doctors from backend on page load
  // Calls GET /api/v1/doctor/all
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await doctorService.getAllDoctors();
        // Backend returns array of approved doctor objects
        setDoctors(data);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError("Failed to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Filter doctors by hospital name if coming from hospital page
  const filteredDoctors = hospitalFilter
    ? doctors.filter((doc) =>
        doc.hospital.toLowerCase().includes(hospitalFilter.toLowerCase())
      )
    : doctors;

  return (
    <div className="doctor-page">

      <div className="doctor-title">
        <h2>{hospitalFilter ? `Doctors at ${hospitalFilter}` : "Available Doctors"}</h2>
        <p>Select your preferred specialist and book instantly</p>
      </div>

      {/* Show loading state */}
      {loading && <p style={{ textAlign: "center" }}>Loading doctors...</p>}
      {/* Show error state */}
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

      <div className="doctor-container">
        {!loading && filteredDoctors.length === 0 && (
          <p style={{ textAlign: "center" }}>No doctors found.</p>
        )}
        {filteredDoctors.map((doc) => (
          <div key={doc._id} className="doctor-card">

            <div className="doctor-left">
              {/* Use backend image if available, otherwise fallback */}
              <img
                src={doc.image ? `http://localhost:8080/uploads/${doc.image}` : doctorImg}
                alt="doctor"
              />
            </div>

            <div className="doctor-middle">
              <h3>{doc.name}</h3>
              <span className="badge">{doc.specialization}</span>

              <div className="doctor-details">
                <p>🏥 {doc.hospital}</p>
                <p>⏳ {doc.experience} Experience</p>
                <p>💰 Consultation Fee: LKR {doc.fee?.toLocaleString()}</p>
              </div>

              {/* Pass doctor data to booking page */}
              <button
                onClick={() => navigate("/booking", {
                  state: {
                    doctorId: doc._id,
                    doctor: doc.name,
                    specialty: doc.specialization,
                    hospital: doc.hospital,
                    fee: doc.fee,
                  }
                })}
                className="book-btn"
              >
                View Details & Book
              </button>
            </div>

            <div className="doctor-right">
              <div className="rating-box">
                ⭐ {doc.rating || "N/A"}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default Doctors;