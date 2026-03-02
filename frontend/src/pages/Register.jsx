import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
// Import useAuth hook to connect with backend registration
import { useAuth } from "../context/useAuth";

function Register() {

  const navigate = useNavigate();
  // Get register function from AuthContext (calls backend API)
  const { register } = useAuth();
  // Loading state to show feedback during API call
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle register - calls backend POST /api/v1/user/register
  const handleRegister = async () => {

    if (!form.name || !form.email || !form.password || !form.phone) {
      alert("Please fill all required fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    // Send registration data to backend via AuthContext
    const result = await register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });
    setLoading(false);

    if (result.success) {
      // Registration successful - redirect to login page
      alert("Registration successful! Please login.");
      navigate("/login");
    } else {
      // Show error from backend (e.g., "User already exists")
      alert(result.message);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-icon">👤</div>

        <h2>Create Account</h2>
        <p className="auth-sub">Register for Smart eChanneling</p>

        <label>Full name</label>
        <input
          name="name"
          placeholder="Enter your full name"
          onChange={handleChange}
        />

        <label>Email address</label>
        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          onChange={handleChange}
        />

        <label>Phone number</label>
        <input
          name="phone"
          placeholder="+94 XX XXX XXXX"
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          onChange={handleChange}
        />

        <label>Confirm password</label>
        <input
          name="confirmPassword"
          type="password"
          placeholder="Re-enter password"
          onChange={handleChange}
        />

        <button className="primary-btn" onClick={handleRegister} disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <div className="bottom-text">
          Already have an account?
          <span onClick={() => navigate("/login")}>
            Sign in here
          </span>
        </div>

      </div>
    </div>
  );
}

export default Register;