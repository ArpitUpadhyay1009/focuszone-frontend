import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import "./UserReview.css";

const UserReview = () => {
  const { user } = useAuth();
  const [starRating, setStarRating] = useState(5);
  const [textReview, setTextReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  // Get user ID from auth context
  useEffect(() => {
    console.log("User from AuthContext:", user);
    console.log("User object keys:", user ? Object.keys(user) : "No user");
    
    if (user) {
      // Extract user ID from the user object - try all possible field names
      const extractedUserId = user._id || user.id || user.userId || user.sub;
      console.log("Extracted userId from AuthContext:", extractedUserId);
      console.log("User._id:", user._id);
      console.log("User.id:", user.id);
      console.log("User.userId:", user.userId);
      
      if (extractedUserId) {
        setUserId(extractedUserId);
      } else {
        console.error("Could not find user ID in user object:", user);
        console.log("Full user object structure:", JSON.stringify(user, null, 2));
        
        // Fallback: try to extract user ID from JWT token
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log("JWT payload:", payload);
              
              const jwtUserId = payload.id || payload._id || payload.userId || payload.sub;
              if (jwtUserId) {
                console.log("Found user ID in JWT token:", jwtUserId);
                setUserId(jwtUserId);
              }
            }
          } catch (tokenError) {
            console.error("Could not decode JWT token:", tokenError);
          }
        }
      }
    } else {
      console.log("No user found in AuthContext");
      setUserId(null);
    }
    
    // Check if user has already submitted a review
    const hasSubmittedReview = localStorage.getItem("hasSubmittedReview");
    if (hasSubmittedReview === "true") {
      setShowForm(false);
    }
  }, [user]);

  const handleStarClick = (rating) => {
    setStarRating(rating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!textReview.trim()) {
      setError("Please enter your feedback");
      return;
    }

    if (!userId) {
      setError("User authentication required. Please refresh the page and try again.");
      return;
    }

    try {
      setIsSubmitting(true);
      // Log the data we're about to send
      const reviewData = {
        starRating,
        textReview,
        userId: userId // This should be the MongoDB ObjectId string
      };
      
      console.log("Sending review data:", reviewData);
      console.log("Current userId:", userId);
      
      const response = await axios.post("/api/review", reviewData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.success) {
        // Store that user has submitted a review
        localStorage.setItem("hasSubmittedReview", "true");
        
        // Show thank you message briefly before hiding the form
        setShowThankYou(true);
        setTimeout(() => {
          setShowForm(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error.response?.data?.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't show form if user is not logged in or form should be hidden
  if (!showForm || !user) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="user-review-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
      >
        {showThankYou ? (
          <motion.div 
            className="thank-you-message"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3>Thank you for your feedback!</h3>
            <p>We appreciate your input and will use it to improve our service.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="user-review-form">
            <h3 className="user-review-form-title">Share Your Feedback</h3>
            <p className="user-review-form-subtitle">Help us improve Focuszone by sharing your experience</p>
            
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className={`star-button ${star <= starRating ? "active" : ""}`}
                  aria-label={`Rate ${star} stars`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    className="star-icon"
                  >
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                </button>
              ))}
            </div>
            
            <div className="text-review-container">
              <textarea
                value={textReview}
                onChange={(e) => setTextReview(e.target.value)}
                placeholder="Share your thoughts about Focuszone..."
                className="text-review-input"
                rows={3}
              />
            </div>
            
            {error && <p className="error-message">{error}</p>}
            
            <button 
              type="submit" 
              className="submit-review-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default UserReview;
