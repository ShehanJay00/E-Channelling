import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Myappoinment.css";
// Import appointment service to fetch/update data from backend
import appointmentService from "../api/appointmentService";
// Import useAuth to check authentication
import { useAuth } from "../context/useAuth";

function MyAppointment() {

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  // Map backend statuses to frontend tabs
  // Backend: "pending" | "approved" | "rejected"
  const [tab, setTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  // Fetch user's appointments from backend on page load
  // Calls GET /api/v1/appointment/user/all (requires auth)
  useEffect(() => {
    const fetchAppointments = async () => {
      // Redirect to login if not authenticated
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        const data = await appointmentService.getMyAppointments();
        // Backend returns { success: true, appointments: [...] }
        setAppointments(data.appointments || []);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [isAuthenticated, navigate]);

  // Filter appointments by current tab (status)
  const filtered = appointments.filter(
    (app) => app.status === tab
  );

  return (
    <div className="myapp-page">

      <h2>My Appointment</h2>

      {/* Status Tabs - matching backend statuses */}
      <div className="tabs">
        <button
          className={tab === "pending" ? "active" : ""}
          onClick={() => setTab("pending")}
        >
          Pending
        </button>
        <button
          className={tab === "approved" ? "active" : ""}
          onClick={() => setTab("approved")}
        >
          Approved
        </button>
        <button
          className={tab === "rejected" ? "active" : ""}
          onClick={() => setTab("rejected")}
        >
          Rejected
        </button>
      </div>

      {/* Show loading state */}
      {loading && <p style={{ textAlign: "center" }}>Loading appointments...</p>}

      {/* If No Appointments found for this tab */}
      {!loading && filtered.length === 0 ? (
        <div className="empty-box">
          <h4>No {tab} appointments</h4>
          <p>You currently have no {tab} appointments.</p>

          <button
            className="book-btn"
            onClick={() => navigate("/hospitals")}
          >
            + Book Appointment
          </button>
        </div>
      ) : (
        !loading && filtered.map((app) => (
          <div key={app._id} className="appointment-card">

            <div>
              {/* Show doctor name from populated doctorId field */}
              <h4>{app.doctorId?.name || "Doctor"}</h4>
              <p>{app.doctorId?.specialization || ""}</p>
              <p>{app.date} | {app.time}</p>
              <span className={`status ${app.status}`}>
                {app.status}
              </span>
            </div>

          </div>
        ))
      )}

    </div>
  );
}

export default MyAppointment;