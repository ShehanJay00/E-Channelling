import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import api from "../api/axios";
import toast from "react-hot-toast";

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all appointments — GET /appointment/all
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointment/all");
      setAppointments(res.data.appointments || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // Update appointment status — PUT /appointment/update/:id
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointment/update/${id}`, { status });
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch {
      toast.error("Update Failed");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <Layout>
      <h4 className="mb-3">📅 All Appointments</h4>

      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-muted">No appointments found</p>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((a, i) => (
                  <tr key={a._id}>
                    <td>{i + 1}</td>
                    <td>{a.userId?.name || "N/A"}</td>
                    <td>{a.doctorId?.name || "N/A"}</td>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td>
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
                    </td>
                    <td>
                      {a.status === "pending" && (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => updateStatus(a._id, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => updateStatus(a._id, "rejected")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {a.status !== "pending" && (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AllAppointments;