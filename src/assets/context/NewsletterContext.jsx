import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const NewsletterContext = createContext();

export const NewsletterProvider = ({ children }) => {
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Check subscription status when user changes
  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
    } else {
      setSubscriptionStatus(null);
    }
  }, [user]);

  // Show newsletter modal for new logged-in users after a short delay
  useEffect(() => {
    if (user && subscriptionStatus === false) {
      // Only show modal if user is not subscribed
      const hasShownModal = localStorage.getItem(
        `newsletter_modal_shown_${user.id}`
      );

      if (!hasShownModal) {
        const timer = setTimeout(() => {
          setShowNewsletterModal(true);
          localStorage.setItem(`newsletter_modal_shown_${user.id}`, "true");
        }, 3000); // Show after 3 seconds

        return () => clearTimeout(timer);
      }
    }
  }, [user, subscriptionStatus]);

  const checkSubscriptionStatus = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/newsletter/status", {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      setSubscriptionStatus(response.data.isSubscribed);
    } catch (error) {
      console.error("Failed to check subscription status:", error);
      setSubscriptionStatus(false);
    } finally {
      setIsLoading(false);
    }
  };

  const showModal = () => {
    setShowNewsletterModal(true);
  };

  const hideModal = () => {
    setShowNewsletterModal(false);
  };

  const updateSubscriptionStatus = (status) => {
    setSubscriptionStatus(status);
  };

  const value = {
    showNewsletterModal,
    subscriptionStatus,
    isLoading,
    showModal,
    hideModal,
    checkSubscriptionStatus,
    updateSubscriptionStatus,
  };

  return (
    <NewsletterContext.Provider value={value}>
      {children}
    </NewsletterContext.Provider>
  );
};

export const useNewsletter = () => {
  const context = useContext(NewsletterContext);
  if (!context) {
    throw new Error("useNewsletter must be used within a NewsletterProvider");
  }
  return context;
};
