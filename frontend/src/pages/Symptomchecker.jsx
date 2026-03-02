import React, { useState } from "react";
import "./Symptomchecker.css";
import aiIcon from "../assets/artificial-intelligence.png";
import { useNavigate } from "react-router-dom";
// Import axios instance to call the AI symptom checker endpoint
import api from "../api/axios";

function Symptomchecker() {

  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello 👋 Describe your symptoms and I will guide you."
    }
  ]);

  const [input, setInput] = useState("");
  // Loading state while waiting for backend AI response
  const [loading, setLoading] = useState(false);

  // Send symptoms to backend AI endpoint
  // Calls POST /api/v1/ai/check-symptoms
  const handleSend = async () => {

    if (!input) return;

    const userMessage = { sender: "user", text: input };
    // Show user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Call backend AI symptom checker
      const response = await api.post("/ai/check-symptoms", {
        symptoms: input,
      });

      // Backend returns structured data — store it as a rich message object
      const data = response.data;

      // Store the full structured response so we can render it as a card
      const aiResponse = {
        sender: "ai",
        type: "card",  // flag to render as a styled card
        data: data,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error("Symptom check failed:", err);
      // Fallback to local analysis if backend is unavailable
      const aiResponse = {
        sender: "ai",
        text: "Sorry, the AI service is temporarily unavailable. Please try again later."
      };
      setMessages((prev) => [...prev, aiResponse]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div className="symptom-page">

      <div className="title-section">
        <img src={aiIcon} alt="AI" className="ai-icon" />
        <h1>AI Symptom Chat Assistant</h1>
        <p>Describe your symptoms and get smart medical guidance</p>
      </div>

      <div className="chat-container">

        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>

              {/* Plain text messages (user messages & welcome) */}
              {msg.text && <span>{msg.text}</span>}

              {/* Structured AI card response */}
              {msg.type === "card" && msg.data && (
                <div className="ai-card">

                  {/* Analysis section */}
                  <div className="ai-card-section">
                    <div className="ai-card-label">🩺 Analysis</div>
                    <p>{msg.data.analysis}</p>
                  </div>

                  {/* Severity badge */}
                  {msg.data.severity && (
                    <div className="ai-card-section">
                      <span className={`severity-badge severity-${msg.data.severity.toLowerCase().replace(/[^a-z]/g, "")}`}>
                        ⚠️ Severity: {msg.data.severity}
                      </span>
                    </div>
                  )}

                  {/* Possible conditions */}
                  {msg.data.possibleConditions?.length > 0 && (
                    <div className="ai-card-section">
                      <div className="ai-card-label">🔍 Possible Conditions</div>
                      <div className="condition-tags">
                        {msg.data.possibleConditions.map((c, i) => (
                          <span key={i} className="condition-tag">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Home remedies */}
                  {msg.data.homeRemedies?.length > 0 && (
                    <div className="ai-card-section">
                      <div className="ai-card-label">💊 Home Remedies</div>
                      <ul className="remedy-list">
                        {msg.data.homeRemedies.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommended specialist */}
                  <div className="ai-card-section specialist-box">
                    <span>👨‍⚕️ Recommended Specialist:</span>
                    <strong> {msg.data.recommendedDoctor}</strong>
                  </div>

                </div>
              )}

            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your symptoms..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>

        <div className="disclaimer">
          ⚠ This AI tool is for informational purposes only.
          Always consult a licensed healthcare professional.
        </div>

        <button
          className="book-now-btn"
          onClick={() => navigate("/hospitals")}
        >
          Book Appointment
        </button>

      </div>

    </div>
  );
}

export default Symptomchecker;