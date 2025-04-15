import React from "react";
import Navbar2 from "@components/navbar2/Navbar2.jsx";
import "./Dashboard.css";
import TimerApp from "@components/timerApp/TimerApp.jsx";
import LevelRenders from "@components/levelRenders/LevelRenders.jsx";
import "@components/levelRenders/LevelRenders.css"; // Import the shadow override CSS
import LevelUpgradeSystem from "@components/LevelUpgradeSystem/LevelUpgradeSystem.jsx";
import SpotifyEmbed2 from "@components/spotify2/SpotifyEmbed2.jsx";
import TodoList from "@components/todo/todo.jsx";

export const Home = () => {
  return (
    <>
      <div>
        <Navbar2 />
      </div>
      <div className="flex flex-col md:flex-row flex-wrap justify-center items-center space-y-0 md:space-y-0 md:space-x-40">
        <div className="mt-20 mb-5 ml-7 md:ml-5 lg:mb-100 lg:ml-15 flex justify-center w-full md:w-auto">
          <TimerApp />
        </div>
        <div className="mt-0 mr-5 md:mr-5 lg:mr-20">
          <div className="shadow-none">
            <LevelRenders />
          </div>
          <LevelUpgradeSystem />
          <SpotifyEmbed2 />
        </div>
      </div>
      <div className="mt-10">
        <TodoList />
      </div>
    </>
  );
};

export default Home;
