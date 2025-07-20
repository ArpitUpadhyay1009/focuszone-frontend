import React from "react";
import Navbar2 from "@components/navbar2/Navbar2.jsx";
import "./Dashboard.css";
import TimerApp from "@components/timerApp/TimerApp.jsx";
import UserStatsDisplay from "../../components/userStatsDisplay/UserStatsDisplay.jsx"; // Import the new component
import LevelRenders from "@components/levelRenders/LevelRenders.jsx";
import "@components/levelRenders/LevelRenders.css";
import LevelUpgradeSystem from "@components/LevelUpgradeSystem/LevelUpgradeSystem.jsx";
import SpotifyEmbed2 from "@components/spotify2/SpotifyEmbed2.jsx";
import TodoList from "@components/todo/todo.jsx";
import AnimatedBackground from "@components/AnimatedBackground/AnimatedBackground.jsx";
import Footer from "@components/footer/Footer.jsx";

export const Home = () => {
  return (
    <div className="app-container">
      <AnimatedBackground />
      <Navbar2 />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center md:items-start gap-8 py-6 md:py-8 "> {/* Changed md:items-center to md:items-start */}
          <div className="w-full max-w-md flex flex-col items-center lg:mr-[10%] gap-10"> {/* Removed lg:mb-[30%] */}
            <div className="w-full"><TimerApp /></div>
            <div className="w-full mt-5"><SpotifyEmbed2/></div>
            {/* <div className="w-full mt-15"><UserStatsDisplay /></div> */}
          </div>
          <div className="w-full max-w-md flex flex-col items-center gap-6">
            <div className="w-full flex flex-col items-center">
              <div className="w-full">
                <LevelRenders />
              </div>
              <div className="w-full mt-[5%] px-4">
                <LevelUpgradeSystem/>
              </div>
            </div>
            <div className="hidden !hidden">
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
