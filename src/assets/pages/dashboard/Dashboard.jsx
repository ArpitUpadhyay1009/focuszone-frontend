import React from "react";
import Navbar2 from "@components/navbar2/Navbar2.jsx";
import "./Dashboard.css";
import TimerApp from "@components/timerApp/TimerApp.jsx";
import LevelRenders from "@components/levelRenders/LevelRenders.jsx";
import LevelUpgradeSystem from "@components/LevelUpgradeSystem/LevelUpgradeSystem.jsx";
import SpotifyEmbed from "@components/spotify/SpotifyEmbed.jsx";
import TodoList from "@components/todo/todo.jsx";

export const Home = () => {
  return (
    <>
      <div>
        <Navbar2 />
      </div>
      <div className="flex flex-col md:flex-row flex-wrap justify-center items-center space-y-0 md:space-y-0 md:space-x-40">
        <div className="mt-20 mb-5 ml-2 md:ml-5 lg:mt-1 lg:ml-15">
          <TimerApp />
        </div>
        <div className="mt-0 mr-5 md:mr-5 lg:mr-20">
          <LevelRenders />
          <LevelUpgradeSystem />
          <SpotifyEmbed />
        </div>
      </div>
      <div className="mt-10">
        <TodoList />
      </div>
    </>
  );
};

export default Home;
