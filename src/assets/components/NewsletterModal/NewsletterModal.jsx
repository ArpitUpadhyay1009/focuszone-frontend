import React, { useState } from "react";
import axios from "axios";
import "./NewsletterModal.css";

const NewsletterModal = ({ isOpen, onClose, userEmail = "" }) => {
  const [email, setEmail] = useState(userEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/newsletter/subscribe",
        { email: email.trim() },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      setMessage(response.data.message);
      setMessageType("success");

      // Close modal after 2 seconds on success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to subscribe to newsletter";
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMessage("");
    setMessageType("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="newsletter-modal-overlay" onClick={handleClose}>
      <div className="newsletter-modal" onClick={(e) => e.stopPropagation()}>
        <div className="newsletter-modal-header">
          <h2>Join Our Newsletter</h2>
          <button className="newsletter-modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="newsletter-modal-body">
          <p>
            Stay updated with the latest features, tips, and productivity
            insights from FocusZone!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="newsletter-form-group">
              <label htmlFor="newsletter-email">Email Address</label>
              <input
                type="email"
                id="newsletter-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={isLoading}
              />
            </div>

            {message && (
              <div className={`newsletter-message ${messageType}`}>
                {message}
              </div>
            )}

            <div className="newsletter-modal-actions">
              <button
                type="button"
                className="newsletter-btn newsletter-btn-secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                Maybe Later
              </button>
              <button
                type="submit"
                className="newsletter-btn newsletter-btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsletterModal;
