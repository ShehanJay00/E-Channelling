import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Booking.css";
// Import appointment service to create bookings in backend
import appointmentService from "../api/appointmentService";
// Import useAuth to check if user is logged in before booking
import { useAuth } from "../context/useAuth";

function Booking() {

  const navigate = useNavigate();
  const location = useLocation();
  // Get user from AuthContext to check authentication
  const { isAuthenticated } = useAuth();

  // Doctor data passed from Viewdoctor page via navigate state
  const doctorData = location.state || {
    doctorId: null,
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    hospital: "City General Hospital",
    fee: 3500
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: ""
  });
  // Loading state for API call
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle booking - calls backend POST /api/v1/appointment/create
  const handleConfirm = async () => {

    // Check if user is logged in before allowing booking
    if (!isAuthenticated) {
      alert("Please login to book an appointment");
      navigate("/login");
      return;
    }

    if (!form.date || !form.time) {
      alert("Please select date and time");
      return;
    }

    // Check if we have a valid doctor ID from navigation state
    if (!doctorData.doctorId) {
      alert("Invalid doctor. Please select a doctor from the doctors page.");
      navigate("/doctors");
      return;
    }

    try {
      setLoading(true);
      // Send appointment data to backend
      // Backend expects: { doctorId, date, time }
      // userId is automatically set from JWT token on the server
      await appointmentService.createAppointment({
        doctorId: doctorData.doctorId,
        date: form.date,
        time: form.time,
      });

      alert("Appointment booked successfully!");
      // Redirect to my appointments page after successful booking
      navigate("/myappoinment");
    } catch (err) {
      console.error("Booking failed:", err);
      alert(err.response?.data?.message || "Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-wrapper">

      {/* LEFT SIDE - FORM */}
      <div className="booking-form">

        <h2>Book Your Appointment</h2>
        <p>Fill in your details and select preferred date & time</p>

        <label>Full Name</label>
        <input name="name" onChange={handleChange} />

        <label>Email Address</label>
        <input name="email" type="email" onChange={handleChange} />

        <label>Phone Number</label>
        <input name="phone" onChange={handleChange} />

        <label>Select Date</label>
        <input type="date" name="date" onChange={handleChange} />

        <label>Select Time</label>
        <input type="time" name="time" onChange={handleChange} />

        <button className="confirm-btn" onClick={handleConfirm} disabled={loading}>
          {loading ? "Booking..." : "Confirm Booking"}
        </button>

      </div>

      {/* RIGHT SIDE - SUMMARY */}
      <div className="booking-summary">

        <h3>Booking Summary</h3>

        <div className="summary-card">
          <h4>{doctorData.doctor}</h4>
          <p>{doctorData.specialty}</p>
          <p>{doctorData.hospital}</p>

          <div className="fee-box">
            Consultation Fee:
            <strong> LKR {doctorData.fee}</strong>
          </div>

          <div className="note-box">
            Please arrive 15 minutes before your scheduled time.
          </div>
        </div>

      </div>

    </div>
  );
}

export default Booking;