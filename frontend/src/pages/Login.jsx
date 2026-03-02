import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
// Import useAuth hook to connect with backend authentication
import { useAuth } from "../context/useAuth";

function Auth() {

  const navigate = useNavigate();
  // Get login function from AuthContext (calls backend API)
  const { login } = useAuth();
  const [step, setStep] = useState("login");
  // Loading state to show feedback during API call
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    newPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle login - calls backend POST /api/v1/user/login
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    // Call the login function from AuthContext which sends request to backend
    const result = await login(form.email, form.password);
    setLoading(false);

    if (result.success) {
      // Login successful - redirect to home page
      navigate("/");
    } else {
      // Show error message from backend
      alert(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* 🔹 LOGIN */}
        {step === "login" && (
          <>
            <div className="auth-icon">✉️</div>
            <h2>Welcome Back</h2>
            <p className="sub-text">
              Sign in to your Smart eChanneling account
            </p>

            <label>Email address</label>
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
              value={form.email}
              onChange={handleChange}
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />

            <div className="forgot">
              <span onClick={() => setStep("forgot")}>
                Forgot password?
              </span>
            </div>

            <button className="primary-btn" onClick={handleLogin} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="bottom-text">
              Don’t have an account?{" "}
              <span onClick={() => navigate("/register")}>
                Register here
              </span>
            </p>
          </>
        )}

        {/* 🔹 FORGOT PASSWORD */}
        {step === "forgot" && (
          <>
            <div className="back" onClick={() => setStep("login")}>
              ← Back
            </div>

            <h3>Forgot Password</h3>
            <p className="sub-text">
              Enter your registered email address
            </p>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />

            <button
              className="primary-btn"
              onClick={() => setStep("otp")}
            >
              Continue
            </button>
          </>
        )}

        {/* 🔹 OTP */}
        {step === "otp" && (
          <>
            <div className="back" onClick={() => setStep("forgot")}>
              ← Back
            </div>

            <h3>Enter your OTP</h3>
            <p className="sub-text">
              We have sent an OTP to your email
            </p>

            <div className="otp-box">
              <input maxLength="1" />
              <input maxLength="1" />
              <input maxLength="1" />
              <input maxLength="1" />
            </div>

            <button
              className="primary-btn"
              onClick={() => setStep("change")}
            >
              Verify
            </button>
          </>
        )}

        {/* 🔹 CHANGE PASSWORD */}
        {step === "change" && (
          <>
            <div className="back" onClick={() => setStep("otp")}>
              ← Back
            </div>

            <h3>Change Password</h3>

            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={handleChange}
            />

            <button
              className="primary-btn"
              onClick={() => setStep("success")}
            >
              Continue
            </button>
          </>
        )}

        {/* 🔹 SUCCESS */}
        {step === "success" && (
          <>
            <div className="success-icon">✔</div>
            <h3>Password Changed</h3>

            <button
              className="primary-btn"
              onClick={() => setStep("login")}
            >
              Back to Login
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default Auth;