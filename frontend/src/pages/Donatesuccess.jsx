import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Charity.css";

function DonationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const amount = location.state?.amount || 0;

  return (
    <div className="success-page">
      <div className="success-card">
        <h2>✅ Donation successful!</h2>
        <p>Thank you for donating LKR {Number(amount).toLocaleString()}</p>

        <button className="back-btn" onClick={() => navigate("/charity")}>
          Back to charity
        </button>
      </div>
    </div>
  );
}

export default DonationSuccess;