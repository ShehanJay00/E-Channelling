import React, { useState, useEffect } from "react";
import doctorImg from "../assets/doctor.jpg";
import "./TelemedicineFull.css";
// Import services to fetch doctors and create appointments via backend
import doctorService from "../api/doctorService";
import appointmentService from "../api/appointmentService";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

function TelemedicineFull() {

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState("list");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  // State for doctors fetched from backend
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  // Booking loading state
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch all approved doctors from backend on page load
  // Calls GET /api/v1/doctor/all
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await doctorService.getAllDoctors();
        setDoctors(data);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Filter doctors by name or specialization based on search
  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const bookDoctor = (doc) => {
    // Check auth before showing booking form
    if (!isAuthenticated) {
      alert("Please login to book a consultation");
      navigate("/login");
      return;
    }
    setSelectedDoctor(doc);
    setStep("booking");
  };

  // Create telemedicine appointment in backend
  // Calls POST /api/v1/appointment/create
  const confirmBooking = async () => {
    try {
      setBookingLoading(true);
      // Create appointment with type "Telemedicine" (today's date & current time)
      const today = new Date().toISOString().split("T")[0];
      const now = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });

      await appointmentService.createAppointment({
        doctorId: selectedDoctor._id,
        date: today,
        time: now,
      });

      setStep("video");
    } catch (err) {
      console.error("Booking failed:", err);
      alert(err.response?.data?.message || "Failed to book consultation");
    } finally {
      setBookingLoading(false);
    }
  };

  const sendMessage = () => {
    if (!input) return;
    setMessages([...messages, { text: input }]);
    setInput("");
  };

  return (
    <div className="tele-full-page">

      <div className="tele-container">

        {/* 🔵 LIST */}
        {step === "list" && (
          <>
            <div className="tele-title">
              <h1>👩‍⚕️ Online Doctor Consultation</h1>
              <p>Consult certified specialists via secure video & chat</p>
            </div>

            <div className="tele-search">
              <input
                type="text"
                placeholder="🔍 Search doctor or specialty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Show loading state while doctors are being fetched */}
            {loading && <p style={{textAlign:'center'}}>Loading doctors...</p>}

            {/* Render each doctor card with backend data */}
            {filteredDoctors.map((doc) => (
              <div key={doc._id} className="tele-card">

                {/* Doctor image from backend uploads folder, fallback to local asset */}
                <img
                  src={doc.profilePic ? `http://localhost:8080/uploads/${doc.profilePic}` : doctorImg}
                  alt={doc.name}
                />

                <div className="tele-info">
                  <h3>👨‍⚕ {doc.name}</h3>
                  {/* Backend uses "specialization" instead of "specialty" */}
                  <span className="specialty-badge">
                    🧠 {doc.specialization}
                  </span>

                  <p>🏥 {doc.hospital}</p>
                  <p>💰 LKR {doc.fee}</p>

                  <button
                    onClick={() => bookDoctor(doc)}
                    className="book-btn"
                  >
                    📅 Book Consultation
                  </button>
                </div>

                <div className="rating-badge">
                  ⭐ {doc.rating || "N/A"}
                </div>

              </div>
            ))}
          </>
        )}

        {/* 🟡 BOOKING */}
        {step === "booking" && selectedDoctor && (
          <div className="booking-box">
            <h2>📅 Confirm Tele Consultation</h2>
            <h3>{selectedDoctor.name}</h3>
            {/* Use specialization field from backend */}
            <p>{selectedDoctor.specialization}</p>
            <p>💰 Fee: LKR {selectedDoctor.fee}</p>

            <button
              onClick={confirmBooking}
              className="book-btn"
              disabled={bookingLoading}
            >
              {bookingLoading ? "Booking..." : "🎥 Confirm & Join Video"}
            </button>
          </div>
        )}

        {/* 🔴 VIDEO */}
        {step === "video" && (
          <>
            <div className="video-container">

              <div className="video-box">
                🎥 Live Video Consultation
              </div>

              <div className="chat-box">

                <div className="chat-messages">
                  {messages.map((msg, index) => (
                    <div key={index} className="message">
                      💬 {msg.text}
                    </div>
                  ))}
                </div>

                <div className="chat-input">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                  />
                  <button onClick={sendMessage}>
                    📤
                  </button>
                </div>

              </div>

            </div>

            <div style={{ textAlign: "center" }}>
              <button
                className="end-call"
                onClick={() => setStep("list")}
              >
                📞 End Call
              </button>
            </div>
          </>
        )}

      </div>

    </div>
  );
}

export default TelemedicineFull;