import { useState } from "react";
import Navbar2 from "@components/navbar2/Navbar2.jsx";
import "./StudyWGram.css";
import TimerApp from "@components/timerApp/TimerApp.jsx";
// import UserStatsDisplay from "../../components/userStatsDisplay/UserStatsDisplay.jsx"; // Import the new component
import LevelRenders from "@components/levelRenders/LevelRenders.jsx";
import "@components/levelRenders/LevelRenders.css";
import LevelUpgradeSystem from "@components/LevelUpgradeSystem/LevelUpgradeSystem.jsx";
import SpotifyEmbed3 from "@components/spotify3/SpotifyEmbed3.jsx";
import TodoList from "@components/todo/todo.jsx";
import AnimatedBackground from "@components/AnimatedBackground/AnimatedBackground.jsx";
import Footer from "@components/footer/Footer.jsx";
import "@components/common/ThemeStyles.css";

export const StudyWGram = () => {
  const [showSpotifyTip, setShowSpotifyTip] = useState(true);
  return (
    <div className="app-container">
      <AnimatedBackground />
      <Navbar2 />
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-30 max-w-6xl mx-auto py-6 md:py-8">
          {/* Left Column */}
          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="timer-wrapper w-150 mt-[10%] sm:w-full lg:w-120 lg:ml-[-10%]">
              <TimerApp />
            </div>
            <div className="level-wrapper w-150 mt-[0%] sm:w-full lg:w-120 lg:ml-[-5.5%]">
              <LevelUpgradeSystem />
            </div>
            <div className="spotify-wrapper flex justify-center w-full">
              <div
                style={{
                  width: "100%",
                  maxWidth: 400,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "15%",
                }}
                className="lg:ml-[-20%]"
              >
                <div style={{ position: "relative", width: "100%" }}>
                  <SpotifyEmbed3 />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="renders-wrapper w-110 sm:w-full lg:w-120 md:mt-[10%] lg:ml-[4%]">
              <LevelRenders />
            </div>
          </div>
        </div>
        <div className="mt-[5%] mb-12 w-full max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto px-4">
          <TodoList />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudyWGram;
