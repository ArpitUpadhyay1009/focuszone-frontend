import React, { useState, useEffect } from "react";
import Navbar from "@components/navbar/Navbar.jsx";
import "./Home.css";
import TimerApp from "@components/timerApp/TimerApp.jsx";
import SpotifyEmbed from "@components/spotify/SpotifyEmbed.jsx";
import LoginToUnlock from "@components/loginToUnlock/LoginToUnlock.jsx";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "@components/AnimatedBackground/AnimatedBackground.jsx";
import GuestTodoList from "../../components/guestTodo/GuestTodo";
import Footer from "../../components/footer/Footer";
import AboutSection from "../../components/home/AboutSection";
import LevelFake from "../../components/levelFake/LevelFake";
import ReviewForm from "../../components/reviewForm/ReviewForm.jsx";
import "@components/common/ThemeStyles.css";
export const Home = () => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showSpotifyTip, setShowSpotifyTip] = useState(true);

  // Listen for popup events from child components
  useEffect(() => {
    const handlePopupEvent = (e) => {
      setIsPopupOpen(e.detail.isOpen);
    };

    window.addEventListener("popup-state-change", handlePopupEvent);

    return () => {
      window.removeEventListener("popup-state-change", handlePopupEvent);
    };
  }, []);

  const handleLoginClick = () => {
    navigate("/Register");
  };

  return (
    <div className="app-container">
      <AnimatedBackground />
      <div className={isPopupOpen ? "blur-sm transition-all duration-300" : ""}>
        <Navbar />
      </div>
      {showSpotifyTip && (
        <div
          className="spotify-tip"
          style={{
            background: "rgba(17, 24, 39, 0.9)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "1rem",
            padding: "0.5rem",
            boxShadow:
              "0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 14 }}>
            Login to Spotify to avoid song skipping
          </span>
          <button
            onClick={() => setShowSpotifyTip(false)}
            aria-label="Dismiss Spotify tip"
            style={{
              marginLeft: 8,
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
              opacity: 0.9,
            }}
          >
            ✕
          </button>
        </div>
      )}
      <div className="container mx-auto px-4">
        <div
          className={`flex flex-col md:flex-row justify-center items-center md:items-center gap-8 md:gap-12 lg:gap-16 py-6 md:py-8 transition-all duration-300 ${
            isPopupOpen ? "blur-sm" : ""
          }`}
        >
          <div className="w-full max-w-md flex flex-col justify-center gap-6">
            <TimerApp setParentPopupState={setIsPopupOpen} />
            <div className="w-full relative z-0 ml-0">
              <LevelFake />
            </div>
          </div>
          <div className="w-full max-w-md flex flex-col items-center gap-6">
            <div
              onClick={handleLoginClick}
              className="w-full cursor-pointer transition-transform duration-300 hover:scale-105 rounded-lg relative z-10"
            >
              <LoginToUnlock />
            </div>
            <div className="w-full relative z-10">
              <div className="pointer-events-auto mt-[15%]">
                <SpotifyEmbed />
              </div>
            </div>
          </div>
        </div>
      </div>
      <GuestTodoList />
      <div className="pt-[3%]">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center section-heading about-section-text">
          About Focuszone.io
        </h2>
        <AboutSection />
        <ReviewForm />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
