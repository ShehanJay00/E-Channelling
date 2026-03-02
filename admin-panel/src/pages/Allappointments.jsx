import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./components/Layout";
import toast from "react-hot-toast";

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("adminToken");

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/appointment/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAppointments(res.data.appointments);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/appointment/update/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Status Updated");
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
      <h4>All Appointments</h4>

      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((a) => (
            <tr key={a._id}>
              <td>{a.userId?.name}</td>
              <td>{a.doctorId?.name}</td>
              <td>{a.date}</td>
              <td>{a.status}</td>

              <td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default AllAppointments;