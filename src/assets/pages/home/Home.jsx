import React from "react";
import Navbar from "@components/navbar/Navbar.jsx";
import "./Home.css";
import TimerApp from "@components/timerApp/TimerApp.jsx";
// import LevelRenders from "../../components/levelRenders/LevelRenders";
import SpotifyEmbed from "@components/spotify/SpotifyEmbed.jsx";
import LoginToUnlock from "@components/loginToUnlock/LoginToUnlock.jsx";

export const Home = () => {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="flex flex-col md:flex-row flex-wrap justify-center items-center space-y-5 md:space-y-0 md:space-x-20">
        <div className="mt-20 ml-2 md:ml-5 lg:mt-1 lg:ml-10">
          <TimerApp />
        </div>
        <div className="flex flex-col w-full max-w-xs md:max-w-md lg:max-w-lg mr-5 mt-0 md:mt-0">
          <LoginToUnlock />
          <SpotifyEmbed />
        </div>
      </div>
    </>
  );
};

export default Home;
