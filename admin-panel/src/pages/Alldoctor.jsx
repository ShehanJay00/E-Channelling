import { useState } from "react";
import axios from "axios";
import Layout from "./components/Layout";
import toast from "react-hot-toast";

const AddDoctor = () => {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    experience: "",
    hospital: "",
    fee: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");

      await axios.post(
        "http://localhost:8080/api/v1/doctor/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Doctor Added Successfully");

      setFormData({
        name: "",
        specialization: "",
        experience: "",
        hospital: "",
        fee: "",
      });

    } catch (error) {
      toast.error("Error Adding Doctor");
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="card shadow-sm p-4" style={{ maxWidth: "600px" }}>
        <h5 className="mb-3 fw-bold">Add doctor</h5>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            className="form-control mb-3"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="specialization"
            className="form-control mb-3"
            placeholder="Specialization"
            value={formData.specialization}
            onChange={handleChange}
          />

          <input
            type="text"
            name="experience"
            className="form-control mb-3"
            placeholder="Experience"
            value={formData.experience}
            onChange={handleChange}
          />

          <input
            type="text"
            name="hospital"
            className="form-control mb-3"
            placeholder="Hospital"
            value={formData.hospital}
            onChange={handleChange}
          />

          <input
            type="number"
            name="fee"
            className="form-control mb-3"
            placeholder="Consultation Fee"
            value={formData.fee}
            onChange={handleChange}
          />

          <button className="btn btn-dark w-100">
            Add Doctor
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddDoctor;