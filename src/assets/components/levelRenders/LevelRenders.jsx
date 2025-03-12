import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext"; // Adjust path as needed

const API_URL = "http://localhost:3001/api/auth"; // Update this if needed

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
        const response = await axios.get(`${API_URL}/user-level`, {
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
    <img
      src={theme === "dark" ? imageDark : imageLight}
      alt={`Level ${level}`}
      className="h-[500px] w-[500px] max-w-full max-h-full sm:h-[300px] sm:w-[350px] md:h-[400px] md:w-[450px] lg:h-[500px] lg:w-[500px] object-contain"
    />
  );
};

export default LevelRenders;
