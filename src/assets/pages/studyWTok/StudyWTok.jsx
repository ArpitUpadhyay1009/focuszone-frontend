import { useState, useEffect } from "react";
import Navbar2 from "@components/navbar2/Navbar2.jsx";
import studyLaptopImage from "../../../../public/profile.jpg"
import "./StudyWTok.css";
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

  // robust dark mode detection covering multiple common implementations
  const detectDarkMode = () => {
    if (typeof window === 'undefined') return false;
    const html = document.documentElement;
    const body = document.body;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const classDark = html.classList.contains('dark') || body.classList.contains('dark');
    const dataThemeDark = (html.getAttribute('data-theme') === 'dark') || (body.getAttribute('data-theme') === 'dark');
    const dataColorModeDark = (html.getAttribute('data-color-mode') === 'dark') || (body.getAttribute('data-color-mode') === 'dark');
    const storedTheme = typeof localStorage !== 'undefined' && (localStorage.getItem('theme') === 'dark' || localStorage.getItem('color-mode') === 'dark');
    return classDark || dataThemeDark || dataColorModeDark || storedTheme || prefersDark;
  };

  const [isDarkMode, setIsDarkMode] = useState(detectDarkMode);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const mqHandler = () => setIsDarkMode(detectDarkMode());
    try { mq.addEventListener('change', mqHandler); } catch { mq.addListener(mqHandler); }

    const mo = new MutationObserver(() => setIsDarkMode(detectDarkMode()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-color-mode'] });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-color-mode'] });

    const storageHandler = (e) => {
      if (!e.key) return;
      if (e.key === 'theme' || e.key === 'color-mode') setIsDarkMode(detectDarkMode());
    };
    window.addEventListener('storage', storageHandler);

    return () => {
      try { mq.removeEventListener('change', mqHandler); } catch { mq.removeListener(mqHandler); }
      mo.disconnect();
      window.removeEventListener('storage', storageHandler);
    };
  }, []);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 lg:gap-30 max-w-6xl mx-auto py-6 md:py-8">
          {/* Left Column - Timer, Level Progress, and Spotify */}
          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="w-150 mt-[10%] sm:w-full md:w-90 md:ml-[5%] max-w-full lg:w-120 lg:ml-[-10%]">
              <TimerApp />
            </div>
            <div className="w-150 mt-[3%] sm:w-full md:w-90 md:ml-[5%] max-w-full lg:w-120 lg:ml-[-10%]">
              <LevelUpgradeSystem />
            </div>
            <div className="flex justify-center w-full">
              <div
                style={{
                  width: "100%",
                  maxWidth: 400,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "15%",
                }}
                className="md:ml-[-20%]"
              >
                <SpotifyEmbed3 />
              </div>
            </div>
          </div>

          {/* Right Column - Level Components */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="w-110 sm:w-75 md:w-85 lg:w-120 md:mt-[10%] max-w-full sm:max-w-80 md:max-w-78 lg:max-w-none ml-0 sm:ml-[2%] md:ml-[4%]">
              <LevelRenders />
            </div>
          </div>
        </div>
        <div className="mt-[5%] mb-12 w-full max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto px-4">
          <TodoList />
        </div>
        <div className="w-full md:w-1/2 max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto px-4 mb-12">
          <div className="card-frosted rounded-2xl overflow-hidden" style={{ backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
            <div className="flex flex-col md:flex-row items-center justify-center p-4 md:p-6 gap-4">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                <img
                  src={studyLaptopImage}
                  alt="Motivation"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="quote-heading text-2xl md:text-3xl font-bold mb-0">
                  "Remember Why You Started"
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudyWGram;
