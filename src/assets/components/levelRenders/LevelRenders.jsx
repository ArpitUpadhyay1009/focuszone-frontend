import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext.jsx"; // Adjust path as needed
import "./LevelRenders.css";

// const API_URL = "/api/auth"; // Update this if needed

const LevelRenders = () => {
  const { theme } = useTheme(); // Get theme from context
  const [imageLight, setImageLight] = useState(null);
  const [imageDark, setImageDark] = useState(null);
  const [level, setLevel] = useState(1);
  // Add states for next level images
  const [nextImageLight, setNextImageLight] = useState(null);
  const [nextImageDark, setNextImageDark] = useState(null);

  useEffect(() => {
    const fetchUserLevelData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(`/api/auth/user-level`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setLevel(response.data.level);
          setImageLight(response.data.imageLight);
          setImageDark(response.data.imageDark);
          
          // After setting current level data, fetch next level data
          fetchNextLevelData(response.data.level);
        }
      } catch (error) {
        console.error("Error fetching user level:", error);
      }
    };

    // Function to fetch next level data
    const fetchNextLevelData = async (currentLevel) => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Fetch the next level's data
        const nextLevel = currentLevel + 1;
        const response = await axios.get(`/api/auth/level-preview/${nextLevel}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          // Preload the images
          preloadImage(response.data.imageLight);
          preloadImage(response.data.imageDark);
          
          // Store the next level image URLs
          setNextImageLight(response.data.imageLight);
          setNextImageDark(response.data.imageDark);
        }
      } catch (error) {
        console.error("Error fetching next level data:", error);
      }
    };

    fetchUserLevelData();
  }, []);

  // Function to preload an image
  const preloadImage = (src) => {
    if (!src) return;
    
    const img = new Image();
    img.src = src;
  };

  // Listen for level upgrade events
  useEffect(() => {
    const handleLevelUpgrade = () => {
      // When level is upgraded, the preloaded images become the current images
      if (nextImageLight) setImageLight(nextImageLight);
      if (nextImageDark) setImageDark(nextImageDark);
      
      // Update level and fetch next level's data
      setLevel(prevLevel => {
        const newLevel = prevLevel + 1;
        fetchNextLevelData(newLevel);
        return newLevel;
      });
    };

    // Function to fetch next level data after upgrade
    const fetchNextLevelData = async (currentLevel) => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const nextLevel = currentLevel + 1;
        const response = await axios.get(`/api/auth/level-preview/${nextLevel}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          preloadImage(response.data.imageLight);
          preloadImage(response.data.imageDark);
          setNextImageLight(response.data.imageLight);
          setNextImageDark(response.data.imageDark);
        }
      } catch (error) {
        console.error("Error fetching next level data:", error);
      }
    };

    // Listen for a custom event that will be dispatched when level is upgraded
    window.addEventListener('levelUpgraded', handleLevelUpgrade);
    
    return () => {
      window.removeEventListener('levelUpgraded', handleLevelUpgrade);
    };
  }, [nextImageLight, nextImageDark]);

  if (!imageLight || !imageDark) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading your space...</p>
      </div>
    );
  }

  return (
    <div className="level-render-container relative w-full max-w-lg mx-auto">
      <div className="flex justify-center items-center">
        <img
          src={theme === "dark" ? imageDark : imageLight}
          alt={`Level ${level} workspace`}
          className="w-full h-auto rounded-lg"
        />
      </div>
    </div>
  );
};

export default LevelRenders;
