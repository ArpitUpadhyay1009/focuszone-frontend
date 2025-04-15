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
        }
      } catch (error) {
        console.error("Error fetching user level:", error);
      }
    };

    fetchUserLevelData();
  }, []);

  if (!imageLight || !imageDark) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <div className="relative w-full max-w-lg mx-auto">
        <img
          src={theme === "dark" ? imageDark : imageLight}
          alt={`Level ${level} environment`}
          className="w-full h-auto rounded-lg transform transition-transform duration-500 hover:scale-105"
          style={{ maxHeight: '500px', objectFit: 'contain' }}
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-bold">
          Level {level}
        </div>
      </div>
    </div>
  );
};

export default LevelRenders;
