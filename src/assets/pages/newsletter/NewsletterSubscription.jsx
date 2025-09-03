import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@components/navbar/Navbar";
import Footer from "@components/footer/Footer";
import "./NewsletterSubscription.css";

const NewsletterSubscription = () => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/newsletter/status", {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      setSubscriptionData(response.data);
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
      setMessage("Failed to load subscription status");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (
      !window.confirm(
        "Are you sure you want to unsubscribe from our newsletter?"
      )
    ) {
      return;
    }

    setIsUnsubscribing(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/newsletter/unsubscribe",
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      setMessage(response.data.message);
      setMessageType("success");

      // Refresh subscription status
      setTimeout(() => {
        fetchSubscriptionStatus();
      }, 1000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to unsubscribe";
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setIsUnsubscribing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="newsletter-page">
        <Navbar />
        <div className="newsletter-container">
          <div className="newsletter-loading">
            <div className="loading-spinner"></div>
            <p>Loading subscription status...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="newsletter-page">
      <Navbar />
      <div className="newsletter-container">
        <div className="newsletter-content">
          <div className="newsletter-header">
            <h1>Newsletter Subscription</h1>
            <button className="back-button" onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>

          {message && (
            <div className={`newsletter-message ${messageType}`}>{message}</div>
          )}

          <div className="subscription-card">
            {subscriptionData?.isSubscribed ? (
              <div className="subscribed-content">
                <div className="status-badge subscribed">✓ Subscribed</div>

                <div className="subscription-details">
                  <h2>You're subscribed to our newsletter!</h2>
                  <p>
                    Thank you for staying connected with FocusZone. We'll send
                    you updates about new features, productivity tips, and more.
                  </p>

                  <div className="subscription-info">
                    <div className="info-item">
                      <label>Email Address:</label>
                      <span>{subscriptionData.subscription.email}</span>
                    </div>
                    <div className="info-item">
                      <label>Subscribed on:</label>
                      <span>
                        {formatDate(subscriptionData.subscription.subscribedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="subscription-actions">
                  <button
                    className="unsubscribe-button"
                    onClick={handleUnsubscribe}
                    disabled={isUnsubscribing}
                  >
                    {isUnsubscribing ? "Unsubscribing..." : "Unsubscribe"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="not-subscribed-content">
                <div className="status-badge not-subscribed">
                  ✗ Not Subscribed
                </div>

                <div className="subscription-details">
                  <h2>You're not subscribed to our newsletter</h2>
                  <p>
                    Join thousands of users who stay updated with the latest
                    FocusZone features, productivity tips, and insights.
                  </p>

                  <div className="newsletter-benefits">
                    <h3>What you'll get:</h3>
                    <ul>
                      <li>🚀 Early access to new features</li>
                      <li>📊 Productivity tips and best practices</li>
                      <li>🎯 Focus techniques and study strategies</li>
                      <li>📈 App updates and improvements</li>
                      <li>🎉 Exclusive content and offers</li>
                    </ul>
                  </div>
                </div>

                <div className="subscription-actions">
                  <button
                    className="subscribe-button"
                    onClick={() => navigate("/newsletter/subscribe")}
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewsletterSubscription;
