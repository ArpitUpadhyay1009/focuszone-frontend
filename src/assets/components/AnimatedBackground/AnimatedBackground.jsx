import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext.jsx";
import "./AnimatedBackground.css";

const AnimatedBackground = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Calculate initial positions based on viewport size
  const calculateInitialPositions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return [
      // Large pill on left side
      {
        id: 1,
        width: width * 0.4,
        height: width * 0.08,
        x: -width * 0.15,
        y: height * 0.15,
        rotation: -45,
        delay: 0.1,
      },
      // Middle left pill
      {
        id: 2,
        width: width * 0.45,
        height: width * 0.08,
        x: -width * 0.05,
        y: height * 0.6,
        rotation: -45, // Changed to match reference image
        delay: 0.3,
      },
      // Large pill on right side
      {
        id: 3,
        width: width * 0.5,
        height: width * 0.08,
        x: width * 0.7,
        y: height * 0.2,
        rotation: -45, // Changed to match reference image
        delay: 0.2,
      },
      // Small pill on bottom right
      {
        id: 4,
        width: width * 0.25,
        height: width * 0.06,
        x: width * 0.8,
        y: height * 0.7,
        rotation: -45, // Changed to match reference image
        delay: 0.4,
      },
    ];
  };

  const [pills, setPills] = useState(calculateInitialPositions());

  // Update pill positions on window resize
  useEffect(() => {
    const handleResize = () => {
      setPills(calculateInitialPositions());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="animated-background">
      {pills.map((pill) => (
        <motion.div
          key={pill.id}
          className={`pill ${isDark ? "dark" : "light"}`}
          initial={{ 
            x: pill.x, 
            y: pill.y,
            rotate: pill.rotation 
          }}
          animate={{ 
            // Special case for pill id 2 - move top right
            x: isDark ? (pill.id === 2 ? pill.x + 100 : pill.x - 100) : pill.x,
            y: isDark ? (pill.id === 2 ? pill.y - 100 : pill.y + 100) : pill.y,
            rotate: isDark ? pill.rotation : pill.rotation
          }}
          transition={{ 
            duration: 2.5, 
            delay: pill.delay,
            ease: "easeInOut"
          }}
          style={{
            width: pill.width,
            height: pill.height,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;