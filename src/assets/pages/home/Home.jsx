import React, { useState, useEffect } from "react";
import Navbar from "@components/navbar/Navbar.jsx";
import "./Home.css";
import TimerApp from "@components/timerApp/TimerApp.jsx";
// import LevelRenders from "../../components/levelRenders/LevelRenders";
import SpotifyEmbed from "@components/spotify/SpotifyEmbed.jsx";
import LoginToUnlock from "@components/loginToUnlock/LoginToUnlock.jsx";
import { useNavigate } from "react-router-dom";

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
    <>
      <div className={isPopupOpen ? "blur-sm transition-all duration-300" : ""}>
        <Navbar />
      </div>
      <div 
        className={`flex flex-col md:flex-row flex-wrap justify-center items-center space-y-5 md:space-y-0 md:space-x-20 transition-all duration-300 ${isPopupOpen ? "blur-sm" : ""}`}
      >
        <div className="mt-20 ml-2 md:ml-5 lg:mt-1 lg:ml-10">
          <TimerApp setParentPopupState={setIsPopupOpen} />
        </div>
        <div className="flex flex-col w-full max-w-xs md:max-w-md lg:max-w-lg mr-5 mt-0 md:mt-0">
          <div 
            onClick={handleLoginClick} 
            className="cursor-pointer transition-transform duration-300 hover:scale-105 rounded-lg"
          >
            <LoginToUnlock />
          </div>
          <SpotifyEmbed />
        </div>
      </div>
    </>
  );
};

export default Home;
