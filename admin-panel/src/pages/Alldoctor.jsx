import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import api from "../api/axios";
import toast from "react-hot-toast";

const AllDoctors = () => {
  // Form state for adding a new doctor
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    experience: "",
    hospital: "",
    fee: "",
    availableDays: "",
  });
  const [image, setImage] = useState(null);
  const [addLoading, setAddLoading] = useState(false);

  // Doctor list from backend
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hospital list for dropdown
  const [hospitals, setHospitals] = useState([]);

  // Fetch all doctors (admin endpoint — includes unapproved)
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/doctor/admin/all");
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch hospitals for the dropdown selector
  const fetchHospitals = async () => {
    try {
      const res = await api.get("/hospital/get-all");
      setHospitals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchHospitals();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add doctor — POST /doctor/create (multipart for image)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.specialization || !formData.hospital || !formData.fee) {
      return toast.error("Please fill in all required fields");
    }

    try {
      setAddLoading(true);
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("specialization", formData.specialization);
      fd.append("experience", formData.experience);
      fd.append("hospital", formData.hospital);
      fd.append("fee", formData.fee);
      if (formData.availableDays) {
        fd.append("availableDays", JSON.stringify(formData.availableDays.split(",")));
      }
      if (image) fd.append("image", image);

      await api.post("/doctor/create", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Doctor Added Successfully");
      setFormData({ name: "", specialization: "", experience: "", hospital: "", fee: "", availableDays: "" });
      setImage(null);
      fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding doctor");
    } finally {
      setAddLoading(false);
    }
  };

  // Approve or reject doctor — PUT /doctor/approve/:id
  const handleApprove = async (id, isApproved) => {
    try {
      await api.put(`/doctor/approve/${id}`, { isApproved });
      toast.success(isApproved ? "Doctor Approved" : "Doctor Rejected");
      fetchDoctors();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // Delete doctor — DELETE /doctor/delete/:id
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    try {
      await api.delete(`/doctor/delete/${id}`);
      toast.success("Doctor Deleted");
      fetchDoctors();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <Layout>
      {/* Add Doctor Form */}
      <div className="card shadow-sm p-4 mb-4" style={{ maxWidth: "700px" }}>
        <h5 className="mb-3 fw-bold">👨‍⚕️ Add Doctor</h5>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Doctor Name *"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                name="specialization"
                className="form-control"
                placeholder="Specialization *"
                value={formData.specialization}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                name="experience"
                className="form-control"
                placeholder="Experience (e.g. 10 Years)"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              {/* Hospital dropdown — populated from database */}
              <select
                name="hospital"
                className="form-select"
                value={formData.hospital}
                onChange={handleChange}
              >
                <option value="">Select Hospital *</option>
                {hospitals.map((h) => (
                  <option key={h._id} value={h.name}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <input
                type="number"
                name="fee"
                className="form-control"
                placeholder="Fee (LKR) *"
                value={formData.fee}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <input
                type="text"
                name="availableDays"
                className="form-control"
                placeholder="Days (Mon,Tue,Wed)"
                value={formData.availableDays}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
          </div>

          <button className="btn btn-dark" disabled={addLoading}>
            {addLoading ? "Adding..." : "Add Doctor"}
          </button>
        </form>
      </div>

      {/* Doctor List Table */}
      <div className="card shadow-sm">
        <div className="card-header fw-bold">
          All Doctors ({doctors.length})
        </div>
        <div className="card-body p-0">
          {loading ? (
            <p className="text-center py-3">Loading...</p>
          ) : (
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Hospital</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-3 text-muted">
                      No doctors found
                    </td>
                  </tr>
                ) : (
                  doctors.map((doc, i) => (
                    <tr key={doc._id}>
                      <td>{i + 1}</td>
                      <td>{doc.name}</td>
                      <td>{doc.specialization}</td>
                      <td>{doc.hospital}</td>
                      <td>LKR {doc.fee?.toLocaleString()}</td>
                      <td>
                        <span
                          className={`badge ${
                            doc.isApproved ? "bg-success" : "bg-warning text-dark"
                          }`}
                        >
                          {doc.isApproved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td>
                        {!doc.isApproved && (
                          <button
                            className="btn btn-sm btn-success me-1"
                            onClick={() => handleApprove(doc._id, true)}
                          >
                            Approve
                          </button>
                        )}
                        {doc.isApproved && (
                          <button
                            className="btn btn-sm btn-warning me-1"
                            onClick={() => handleApprove(doc._id, false)}
                          >
                            Revoke
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(doc._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AllDoctors;