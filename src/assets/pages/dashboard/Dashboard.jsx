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

export const Home = () => {
  return (
    <div className="app-container">
      <AnimatedBackground />
      <Navbar2 />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-30 max-w-6xl mx-auto py-6 md:py-8">
          {/* Left Column */}
          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="timer-wrapper w-150 mt-[10%] sm:w-full lg:w-120 lg:ml-[-10%]">
              <TimerApp />
            </div>
            <div className="level-wrapper w-150 mt-[0%] sm:w-full lg:w-120 lg:ml-[-5.5%]">
              <LevelUpgradeSystem />
            </div>
            <div className="spotify-wrapper flex justify-center w-full">
              <div
                style={{
                  width: "100%",
                  maxWidth: 400,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "15%",
                }}
                className="lg:ml-[-20%]"
              >
                <SpotifyEmbed2 />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="renders-wrapper w-110 sm:w-full lg:w-120 md:mt-[10%] lg:ml-[4%]">
              <LevelRenders />
            </div>
          </div>
        </div>
        <div className="mt-[5%] mb-12 w-full max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto px-4">
          <TodoList />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
