import React from "react";
import Navbar2 from "@components/navbar2/Navbar2.jsx";
import "./StudyWTok.css";
import TimerApp from "@components/timerApp/TimerApp.jsx";
import LevelRenders from "@components/levelRenders/LevelRenders.jsx";
import "@components/levelRenders/LevelRenders.css";
import LevelUpgradeSystem from "@components/LevelUpgradeSystem/LevelUpgradeSystem.jsx";
import SpotifyEmbed2 from "@components/spotify2/SpotifyEmbed2.jsx";
import TodoList from "@components/todo/todo.jsx";
import AnimatedBackground from "@components/AnimatedBackground/AnimatedBackground.jsx";
import Footer from "../../components/footer/Footer";

export const StudyWTok = () => {
  return (
    <div className="app-container">
      <AnimatedBackground />
      <Navbar2 />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center md:items-start gap-8 py-6 md:py-8 "> {/* Changed md:items-center to md:items-start */}
          <div className="w-full max-w-md flex justify-center lg:mr-[10%]">  {/* Removed lg:mb-[30%] and items-center as justify-center might be enough */}
            <TimerApp />
          </div>
          <div className="w-full max-w-md flex flex-col items-center gap-6">
            <div className="w-full">
              <LevelRenders />
            </div>
            <div className="w-full">
              <LevelUpgradeSystem />
            </div>
            <div className="w-full">
              <SpotifyEmbed2 />
            </div>
          </div>
        </div>
        <div className="mt-8 mb-12 max-w-4xl mx-auto">
          <TodoList />
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default StudyWTok;
