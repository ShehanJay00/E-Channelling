import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import api from "../api/axios";

const Home = () => {
  // Dashboard stats from backend
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalUsers: 0,
    totalAppointments: 0,
    totalHospitals: 0,
    pendingAppointments: 0,
  });
  const [latestAppointments, setLatestAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch admin dashboard stats — GET /user/admin/stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/user/admin/stats");
        setStats(res.data.stats);
        setLatestAppointments(res.data.latestAppointments || []);
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="container-fluid">
        <h4 className="mb-4">📊 Dashboard</h4>

        {loading ? (
          <p>Loading stats...</p>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="row mb-4">
              <div className="col-md-3 mb-3">
                <div className="card shadow-sm text-center p-3 border-start border-primary border-4">
                  <h3>{stats.totalDoctors}</h3>
                  <p className="text-muted mb-0">👨‍⚕️ Doctors</p>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card shadow-sm text-center p-3 border-start border-success border-4">
                  <h3>{stats.totalAppointments}</h3>
                  <p className="text-muted mb-0">📅 Appointments</p>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card shadow-sm text-center p-3 border-start border-info border-4">
                  <h3>{stats.totalUsers}</h3>
                  <p className="text-muted mb-0">👥 Patients</p>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card shadow-sm text-center p-3 border-start border-warning border-4">
                  <h3>{stats.totalHospitals}</h3>
                  <p className="text-muted mb-0">🏥 Hospitals</p>
                </div>
              </div>
            </div>

            {/* Pending Alert */}
            {stats.pendingAppointments > 0 && (
              <div className="alert alert-warning mb-4">
                ⏳ You have <strong>{stats.pendingAppointments}</strong> pending appointment(s) awaiting approval.
              </div>
            )}

            {/* Latest Bookings */}
            <div className="card shadow-sm">
              <div className="card-header fw-bold">Latest Bookings</div>
              <div className="card-body">
                {latestAppointments.length === 0 ? (
                  <p className="text-muted">No bookings yet</p>
                ) : (
                  latestAppointments.map((a) => (
                    <div
                      key={a._id}
                      className="d-flex justify-content-between align-items-center border-bottom py-2"
                    >
                      <div>
                        <strong>{a.doctorId?.name || "Doctor"}</strong>
                        <span className="text-muted ms-2">
                          ({a.doctorId?.specialization || ""})
                        </span>
                        <div className="text-muted small">
                          Patient: {a.userId?.name || "N/A"} &bull; {a.date} at{" "}
                          {a.time}
                        </div>
                      </div>
                      <span
                        className={`badge ${
                          a.status === "approved"
                            ? "bg-success"
                            : a.status === "rejected"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;