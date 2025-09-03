import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@components/navbar/Navbar";
import Footer from "@components/footer/Footer";
import "./NewsletterLanding.css";

const NewsletterLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="newsletter-landing-page">
      <Navbar />
      <div className="newsletter-landing-container">
        <div className="newsletter-landing-content">
          <div className="newsletter-hero">
            <h1>Join Our Newsletter</h1>
            <p>
              Stay updated with the latest FocusZone features, productivity
              tips, and insights.
            </p>
          </div>

          <div className="newsletter-benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🚀</div>
              <h3>Early Access</h3>
              <p>
                Be the first to know about new features and updates before
                they're released to everyone.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">📊</div>
              <h3>Productivity Tips</h3>
              <p>
                Get expert advice on time management, focus techniques, and
                study strategies.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3>Focus Insights</h3>
              <p>
                Learn about the latest research in productivity and how to apply
                it to your daily routine.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🎉</div>
              <h3>Exclusive Content</h3>
              <p>
                Receive special offers, beta access, and content created
                exclusively for our subscribers.
              </p>
            </div>
          </div>

          <div className="newsletter-cta">
            <h2>Ready to join thousands of productive users?</h2>
            <p>
              Sign up for FocusZone and subscribe to our newsletter to get
              started.
            </p>

            <div className="newsletter-actions">
              <Link to="/register" className="cta-button primary">
                Sign Up & Subscribe
              </Link>
              <Link to="/login" className="cta-button secondary">
                Already have an account? Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewsletterLanding;
