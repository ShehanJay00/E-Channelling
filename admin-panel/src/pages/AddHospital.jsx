import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import api from "../api/axios";
import toast from "react-hot-toast";

const AddHospital = () => {
  // Form state for adding a new hospital
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // List of hospitals from backend
  const [hospitals, setHospitals] = useState([]);

  // Fetch all hospitals on page load
  const fetchHospitals = async () => {
    try {
      const res = await api.get("/hospital/get-all");
      setHospitals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  // Handle form submit — POST /hospital/add
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !location) return toast.error("Name and Location are required");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      formData.append("rating", rating || 0);
      if (image) formData.append("image", image);

      await api.post("/hospital/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Hospital Added Successfully");
      // Reset form
      setName("");
      setLocation("");
      setRating("");
      setImage(null);
      // Refresh list
      fetchHospitals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding hospital");
    } finally {
      setLoading(false);
    }
  };

  // Delete a hospital — DELETE /hospital/delete/:id
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hospital?")) return;
    try {
      await api.delete(`/hospital/delete/${id}`);
      toast.success("Hospital Deleted");
      fetchHospitals();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <Layout>
      {/* Add Hospital Form */}
      <div className="card shadow-sm p-4 mb-4" style={{ maxWidth: "600px" }}>
        <h5 className="mb-3 fw-bold">🏥 Add Hospital</h5>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Hospital Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Location *"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Rating (0-5)"
                min="0"
                max="5"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="submit" className="btn btn-dark" disabled={loading}>
              {loading ? "Adding..." : "Add Hospital"}
            </button>
          </div>
        </form>
      </div>

      {/* Hospital List Table */}
      <div className="card shadow-sm">
        <div className="card-header fw-bold">All Hospitals ({hospitals.length})</div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Location</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-3 text-muted">
                    No hospitals found
                  </td>
                </tr>
              ) : (
                hospitals.map((h, i) => (
                  <tr key={h._id}>
                    <td>{i + 1}</td>
                    <td>
                      {h.image ? (
                        <img
                          src={`http://localhost:8080/uploads/${h.image}`}
                          alt={h.name}
                          style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }}
                        />
                      ) : (
                        <span style={{ fontSize: 24 }}>🏥</span>
                      )}
                    </td>
                    <td>{h.name}</td>
                    <td>{h.location}</td>
                    <td>⭐ {h.rating || "N/A"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(h._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AddHospital;