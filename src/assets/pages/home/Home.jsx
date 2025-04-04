import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";
import TimerApp from "../../components/TimerApp/TimerApp";
// import LevelRenders from "../../components/levelRenders/LevelRenders";
import SpotifyEmbed from "../../components/Spotify/SpotifyEmbed";
import LoginToUnlock from "../../components/LoginToUnlock/LoginToUnlock";

export const Home = () => {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="flex flex-row flex-nowrap md:flex-wrap sm:flex-wrap xs:flex-wrap lg:flex-nowrap justify-between align-middle">
        <div className="mt-50 ml-55 md:ml-2 md:mt-25 sm:mt-10 sm:ml-5 lg:mt-50 lg:ml-55">
          <TimerApp />
        </div>
        <div className="flex flex-col w-auto mr-[10%] mt-[5%]">
          <LoginToUnlock />
          <SpotifyEmbed />
        </div>
      </div>
    </>
  );
};

export default Home;
