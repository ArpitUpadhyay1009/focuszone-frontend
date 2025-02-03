import React from "react";
import Navbar from "../../components/navbar/Navbar";
import "./Home.css";
import TimerApp from "../../components/timerApp/TimerApp";
import LevelRenders from "../../components/levelRenders/LevelRenders";
import SpotifyEmbed from "../../components/spotify/SpotifyEmbed";

export const Home = () => {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="flex flex-row flex-wrap justify-between align-middle">
        <div className="mt-50 ml-55 md:ml-2 md:mt-25 sm:mt-10 sm:ml-5 lg:mt-50 lg:ml-55">
          <TimerApp />
        </div>
        <div className="mt-10 mr-30">
          <LevelRenders />
          <SpotifyEmbed />
        </div>
      </div>
    </>
  );
};

export default Home;
