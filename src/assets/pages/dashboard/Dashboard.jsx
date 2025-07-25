import React from "react";
import Navbar2 from "@components/navbar2/Navbar2.jsx";
import "./Dashboard.css";
import TimerApp from "@components/timerApp/TimerApp.jsx";
// import UserStatsDisplay from "../../components/userStatsDisplay/UserStatsDisplay.jsx"; // Import the new component
import LevelRenders from "@components/levelRenders/LevelRenders.jsx";
import "@components/levelRenders/LevelRenders.css";
import LevelUpgradeSystem from "@components/LevelUpgradeSystem/LevelUpgradeSystem.jsx";
import SpotifyEmbed2 from "@components/spotify2/SpotifyEmbed2.jsx";
import TodoList from "@components/todo/todo.jsx";
import AnimatedBackground from "@components/AnimatedBackground/AnimatedBackground.jsx";
import Footer from "@components/footer/Footer.jsx";
import RouteDropdown from "@components/common/RouteDropdown";

export const Home = () => {
  return (
    <div className="app-container">
      <AnimatedBackground />
      <Navbar2 />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 lg:gap-30 max-w-6xl mx-auto py-6 md:py-8">
          {/* Left Column - Timer and Spotify */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="w-150 sm:w-full md:w-90 md:ml-[5%] max-w-full  lg:w-120 lg:ml-[-10%]">
              <TimerApp />
            </div>
            <div className="flex justify-center w-full">
              <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '35%' }}>
                <RouteDropdown />
                <div style={{ height: 10 }} />
                <SpotifyEmbed2 />
              </div>
            </div>
          </div>

          {/* Right Column - Level Components */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="w-110 sm:w-75 md:w-85 lg:w-120 md:mt-[-18%] max-w-full sm:max-w-80 md:max-w-78 lg:max-w-none ml-0 sm:ml-[2%] md:ml-[4%]">
              <LevelRenders />
            </div>
            <div className="w-full sm:w-80 md:w-96 lg:w-100 px-2 sm:px-4 max-w-full sm:max-w-80 md:max-w-96 lg:max-w-none md:mt-[25%] lg:mt-[0%] lg:ml-[13%]">
              <LevelUpgradeSystem />
            </div>
          </div>
        </div>
        <div className="mt-8 mb-12 w-full max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto px-4">
          <TodoList />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
