import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Hospital.css";
import image from "../assets/hospitals.jpg";
// Import hospital API service to fetch data from backend
import hospitalService from "../api/hospitalService";

function Hospitals() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  // State for hospitals fetched from backend
  const [hospitals, setHospitals] = useState([]);
  // Loading & error states for better UX
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch hospitals from backend on page load
  // Calls GET /api/v1/hospital/get-all
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const data = await hospitalService.getAllHospitals();
        // Backend returns an array of hospital objects
        setHospitals(data);
      } catch (err) {
        console.error("Failed to fetch hospitals:", err);
        setError("Failed to load hospitals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  // Filter hospitals by name or location based on search input
  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.name.toLowerCase().includes(search.toLowerCase()) ||
    hospital.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hospital-page">

      <div className="hospital-hero">
        <h1>Find hospitals near you</h1>
        <p>Browse our network of trusted healthcare facilities</p>
      </div>

      {/* ✅ SEARCH BAR */}
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search hospital or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="hospital-grid">
        {/* Show loading spinner while fetching */}
        {loading && <p className="no-result">Loading hospitals...</p>}
        {/* Show error if API call failed */}
        {error && <p className="no-result">{error}</p>}
        {/* Show hospitals once loaded */}
        {!loading && !error && filteredHospitals.length > 0 ? (
          filteredHospitals.map((h) => (
            <div key={h._id} className="hospital-card">

              {/* Use backend image if available, otherwise fallback to default */}
              <img
                src={h.image ? `http://localhost:8080/uploads/${h.image}` : image}
                alt="hospital"
                className="hospital-img"
              />

              <div className="card-body">
                <h3>{h.name}</h3>
                <p>📍 {h.location}</p>

                {/* Pass hospital name to doctors page so it can filter */}
                <button
                  onClick={() => navigate("/doctors", { state: { hospital: h.name } })}
                  className="view-btn"
                >
                  View Doctors
                </button>

                <div className="rating">⭐ {h.rating || "N/A"}</div>
              </div>

            </div>
          ))
        ) : (
          !loading && <p className="no-result">No hospitals found</p>
        )}
      </div>

    </div>
  );
}

export default Hospitals;