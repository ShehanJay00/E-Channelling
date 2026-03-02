import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Charity.css";
// Import donation service to send donation to backend
import donationService from "../api/donationService";

function Donate() {
  const navigate = useNavigate();
  const location = useLocation();
  // Get amount passed from Charity page
  const amount = location.state?.amount || 0;
  // Form state for donor name
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle payment - sends donation to backend
  // Calls POST /api/v1/donation/donate
  const handlePayment = async () => {
    try {
      setLoading(true);
      // Send donation data to backend
      await donationService.createDonation({
        name: name || "Anonymous",    // Default to "Anonymous" if no name entered
        amount: Number(amount),
        paymentMethod: "card",        // Payment method (card by default)
      });
      // Redirect to success page after successful donation
      navigate("/donation-success", { state: { amount } });
    } catch (err) {
      console.error("Donation failed:", err);
      alert(err.response?.data?.message || "Donation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donate-page">
      <div className="donate-card">
        <h3>Complete your donation</h3>

        <p><strong>Amount: LKR {Number(amount).toLocaleString()}</strong></p>

        <label>Card Number</label>
        <input type="text" placeholder="1234 5678 9012 3456" />

        <label>Card Holder Name</label>
        <input
          type="text"
          placeholder="John Doe (leave empty for anonymous)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="row">
          <input type="text" placeholder="MM/YY" />
          <input type="text" placeholder="CVV" />
        </div>

        <button className="donate-btn" onClick={handlePayment} disabled={loading}>
          {loading ? "Processing..." : "❤️ Donate now"}
        </button>
      </div>
    </div>
  );
}

export default Donate;