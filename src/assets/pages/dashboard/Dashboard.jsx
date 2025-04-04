import React from "react";
import Navbar2 from "../../components/Navbar2/Navbar2";
import "./Dashboard.css";
import TimerApp from "../../components/TimerApp/TimerApp";
import LevelRenders from "../../components/LevelRenders/LevelRenders";

import LevelUpgradeSystem from "../../components/LevelUpgradeSystem/LevelUpgradeSystem";

import SpotifyEmbed from "../../components/Spotify/SpotifyEmbed";
import TodoList from "../../components/todo/todo";

export const Home = () => {
  return (
    <>
      <div>
        <Navbar2 />
      </div>
      <div className="flex flex-row flex-wrap justify-between align-middle">
        <div className="mt-50 ml-55 md:ml-2 md:mt-25 sm:mt-10 sm:ml-5 lg:mt-50 lg:ml-55">
          <TimerApp />
        </div>
        <div className="mt-10 mr-30">
          <LevelRenders />
          <LevelUpgradeSystem />
          <SpotifyEmbed />
        </div>
      </div>
      <div>
        <TodoList />
      </div>
    </>
  );
};

export default Home;
