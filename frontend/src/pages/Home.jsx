import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import heroImg from "../assets/check.png";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* HERO SECTION */}
      <div className="hero-section">
        <div className="hero-left">
          <h1>Your Health, <span>Our Priority</span></h1>
          <p>
            Book appointments, consult doctors online, check symptoms
            and support healthcare — all in one smart platform.
          </p>

          <div className="hero-buttons">
            <button onClick={() => navigate("/hospitals")} className="primary-btn">
              Book Appointment
            </button>
            <button onClick={() => navigate("/symptomchecker")} className="secondary-btn">
              AI Symptom Checker
            </button>
          </div>
        </div>

        <div className="hero-right">
          <img src={heroImg} alt="Doctor" />
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="features-section">

        <div className="feature-card">
          <h3>🏥 Find Hospitals</h3>
          <p>Search trusted hospitals and specialists near you.</p>
        </div>

        <div className="feature-card">
          <h3>🤖 AI Symptom Checker</h3>
          <p>Analyze your symptoms and get doctor recommendations instantly.</p>
        </div>

        <div className="feature-card">
          <h3>💻 Telemedicine</h3>
          <p>Consult with doctors online via video and chat.</p>
        </div>

        <div className="feature-card">
          <h3>❤️ Charity Support</h3>
          <p>Support healthcare for underprivileged communities.</p>
        </div>

      </div>

      {/* CTA SECTION */}
      <div className="cta-section">
        <h2>Ready to take care of your health?</h2>
        <button onClick={() => navigate("/register")} className="primary-btn">
          Get Started
        </button>
      </div>

    </div>
  );
}

export default Home;