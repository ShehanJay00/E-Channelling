import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Charity.css";
import img from "../assets/child.jpg";
// Import donation service to fetch recent donations from backend
import donationService from "../api/donationService";

function Charity() {
  const [amount, setAmount] = useState(null);
  const navigate = useNavigate();
  // State for recent donations fetched from backend
  const [recentDonations, setRecentDonations] = useState([]);

  const presetAmounts = [1000, 2500, 5000, 10000];

  // Fetch recent donations from backend on page load
  // Calls GET /api/v1/donation/recent
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await donationService.getRecentDonations();
        // Backend returns array of recent donation objects
        setRecentDonations(data);
      } catch (err) {
        console.error("Failed to fetch recent donations:", err);
      }
    };
    fetchDonations();
  }, []);

  const handleDonate = () => {
    if (!amount || amount <= 0) {
      alert("Please select or enter a valid amount");
      return;
    }

    navigate("/donate", { state: { amount: Number(amount) } });
  };

  return (
    <div className="charity-page">
      {/* HEADER */}
      <div className="charity-header">
        <h2>❤️ Support Healthcare for All</h2>
        <p>Your donation helps provide medical care to those in need.</p>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stat-box">
          <h2>❤️ </h2>
          <h3>LKR 1.2M</h3>
          <p>Total raised</p>
        </div>
        <div className="stat-box">
          <h2>❤️ </h2>
          <h3>3</h3>
          <p>Donors</p>
        </div>
        <div className="stat-box">
          <h2>❤️ </h2>
          <h3>4</h3>
          <p>Active cases</p>
        </div>
      </div>

      <div className="charity-content">
        {/* LEFT SIDE */}
        <div className="campaign-list">
          {[1, 2, 3].map((item) => (
            <div className="campaign-card" key={item}>
              <img src={img} alt="Child healthcare" />
              <div className="campaign-info">
                <h3>Child Healthcare Fund</h3>
                <p>
                  Help provide medical care for underprivileged children
                </p>

                <div className="progress-bar">
                  <div className="progress"></div>
                </div>

                <div className="progress-text">
                  <span>LKR 325,000</span>
                  <span>LKR 500,000</span>
                </div>
              </div>
            </div>
          ))}

          {/* RECENT DONATIONS - Fetched from backend */}
          <div className="recent-box">
            <h4>Recent Donations</h4>

            {recentDonations.length === 0 ? (
              <p>No donations yet. Be the first!</p>
            ) : (
              recentDonations.map((donation) => (
                <div className="donation-item" key={donation._id}>
                  <span>❤️ {donation.name || "Anonymous"}</span>
                  <span>LKR {donation.amount?.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="donation-card">
          <h3>Make a donation</h3>
          <p>Every contribution makes a difference</p>

          <h4>Select amount</h4>

          <div className="amount-buttons">
            {presetAmounts.map((value) => (
              <button
                key={value}
                onClick={() => setAmount(value)}
                className={amount === value ? "active" : ""}
              >
                LKR {value.toLocaleString()}
              </button>
            ))}
          </div>

          <h4>Custom amount</h4>

          <input
            type="number"
            placeholder="Enter amount"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="1"
          />

          <button className="donate-btn" onClick={handleDonate}>
            ❤️ Donate now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Charity;