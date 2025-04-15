import React, { useState, useEffect } from "react";
import Navbar from "@components/navbar/Navbar.jsx";
import "./Home.css";
import TimerApp from "@components/timerApp/TimerApp.jsx";
import SpotifyEmbed from "@components/spotify/SpotifyEmbed.jsx";
import LoginToUnlock from "@components/loginToUnlock/LoginToUnlock.jsx";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "@components/AnimatedBackground/AnimatedBackground.jsx";

export const Home = () => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Listen for popup events from child components
  useEffect(() => {
    const handlePopupEvent = (e) => {
      setIsPopupOpen(e.detail.isOpen);
    };
    
    window.addEventListener('popup-state-change', handlePopupEvent);
    
    return () => {
      window.removeEventListener('popup-state-change', handlePopupEvent);
    };
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="app-container">
      <AnimatedBackground />
      <div className={isPopupOpen ? "blur-sm transition-all duration-300" : ""}>
        <Navbar />
      </div>
      <div className="container mx-auto px-4">
        <div className={`flex flex-col md:flex-row justify-center items-center md:items-center gap-8 md:gap-12 lg:gap-16 py-6 md:py-8 transition-all duration-300 ${isPopupOpen ? "blur-sm" : ""}`}>
          <div className="w-full max-w-md flex justify-center">
            <TimerApp setParentPopupState={setIsPopupOpen} />
          </div>
          <div className="w-full max-w-md flex flex-col items-center gap-6">
            <div 
              onClick={handleLoginClick} 
              className="w-full cursor-pointer transition-transform duration-300 hover:scale-105 rounded-lg"
            >
              <LoginToUnlock />
            </div>
            <div className="w-full">
              <SpotifyEmbed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
