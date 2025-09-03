import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { useNewsletter } from "@context/NewsletterContext";
import "./Footer.css";

function Footer() {
  const { user } = useAuth();
  const { subscriptionStatus, showModal } = useNewsletter();

  const handleNewsletterClick = (e) => {
    if (user) {
      if (subscriptionStatus) {
        // User is subscribed, navigate to subscription page
        // Let the Link handle navigation
        return;
      } else {
        // User is not subscribed, show modal
        e.preventDefault();
        showModal();
      }
    } else {
      // User not logged in, navigate to newsletter landing page
      return;
    }
  };

  return (
    <footer className="footer">
      <div className="max-w-6xl mx-auto px-4">
        <div className="footer-links">
          <Link to="/terms-and-conditions" className="footer-link">
            Terms and Conditions
          </Link>
          <Link to="/data-privacy" className="footer-link">
            Data Privacy
          </Link>
          <Link to="/contact-us" className="footer-link">
            Contact Us
          </Link>
          <Link to="/cookies" className="footer-link">
            Cookies and Preferences
          </Link>
          <Link
            to={
              user && subscriptionStatus
                ? "/newsletter"
                : "/newsletter/subscribe"
            }
            className="footer-link newsletter-link"
            onClick={handleNewsletterClick}
          >
            Join Our Newsletter
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
