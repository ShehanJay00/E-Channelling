import React, { useState, useEffect } from "react";
import "./MyProfile.css";
// Import useAuth to get user data from AuthContext
import { useAuth } from "../context/useAuth";
// Import user service for profile update API calls
import userService from "../api/userService";
// Import appointment service to fetch real appointment stats
import appointmentService from "../api/appointmentService";

function MyProfile() {

  // Get user and updateUser from AuthContext (backed by backend data)
  const { user, updateUser, isAuthenticated } = useAuth();
  const [editUser, setEditUser] = useState({});
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  // Appointment stats fetched from backend
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });

  // Initialize edit form with user data from AuthContext
  useEffect(() => {
    if (user) {
      setEditUser(user);
    }
  }, [user]);

  // Fetch appointment stats from backend
  // Calls GET /api/v1/appointment/user/all
  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated) return;
      try {
        const data = await appointmentService.getMyAppointments();
        const appointments = data.appointments || [];
        // Calculate stats from the fetched appointments
        setStats({
          total: appointments.length,
          pending: appointments.filter((a) => a.status === "pending").length,
          approved: appointments.filter((a) => a.status === "approved").length,
        });
      } catch (err) {
        console.error("Failed to fetch appointment stats:", err);
      }
    };
    fetchStats();
  }, [isAuthenticated]);

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  // Save profile changes to backend
  // Calls PATCH /api/v1/user/update-profile (requires auth)
  const handleSave = async () => {
    try {
      setLoading(true);
      // Create FormData for multipart upload (supports image upload)
      const formData = new FormData();
      if (editUser.name) formData.append("name", editUser.name);
      if (editUser.email) formData.append("email", editUser.email);
      if (editUser.phone) formData.append("phone", editUser.phone);

      const data = await userService.updateProfile(formData);
      // Update user in AuthContext (and localStorage) with backend response
      updateUser(data.user);
      setEdit(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">

      <h2>My Profile</h2>
      <p className="sub-text">Manage your personal information</p>

      <div className="profile-card">

        <div className="profile-header">
          <h3>Personal Information</h3>

          {!edit ? (
            <button onClick={() => setEdit(true)}>Edit profile</button>
          ) : (
            <div>
              <button className="cancel-btn" onClick={() => setEdit(false)}>Cancel</button>
              <button className="save-btn" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          )}
        </div>

        <div className="profile-grid">

          <div>
            <label>Full name</label>
            {edit ? (
              <input name="name" value={editUser.name || ""} onChange={handleChange} />
            ) : (
              <p>{user?.name}</p>
            )}
          </div>

          <div>
            <label>Email address</label>
            {edit ? (
              <input name="email" value={editUser.email || ""} onChange={handleChange} />
            ) : (
              <p>{user?.email}</p>
            )}
          </div>

          <div>
            <label>Phone number</label>
            {edit ? (
              <input name="phone" value={editUser.phone || ""} onChange={handleChange} />
            ) : (
              <p>{user?.phone || "Not added"}</p>
            )}
          </div>

        </div>
      </div>

      {/* Stats Section - fetched from backend */}
      <div className="profile-stats">

        <div className="stat-box">
          <h3>{stats.total}</h3>
          <p>Total Appointments</p>
        </div>

        <div className="stat-box">
          <h3>{stats.pending}</h3>
          <p>Pending Appointments</p>
        </div>

        <div className="stat-box">
          <h3>{stats.approved}</h3>
          <p>Approved Appointments</p>
        </div>

      </div>

    </div>
  );
}

export default MyProfile;