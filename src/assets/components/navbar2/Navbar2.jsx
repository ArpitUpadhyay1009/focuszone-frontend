import { useState } from "react";
import "./Navbar2.css";
import Logo from "../logo/Logo.jsx";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle.jsx";
import UserProfileMenu from "../userProfileMenu/UserProfileMenu.jsx";
import AboutPopup from "../AboutPopup/AboutPopup.jsx";
import { motion } from "framer-motion";

export const Navbar2 = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <>
      <nav className="navbar-container">
        <div className="navbar-left">
          <Logo />
        </div>
        <div className="navbar-right">
          <motion.button 
            onClick={() => setIsAboutOpen(true)}
            className="flex items-center justify-center rounded-full h-10 w-10 mx-2 transition-all hover:ring-2 hover:ring-[#7500CA] focus:outline-none bg-[#7500CA] text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="About"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h.01a1 1 0 100-2H10V9z" 
                clipRule="evenodd" 
              />
            </svg>
          </motion.button>
          <DarkModeToggle />
          <UserProfileMenu />
        </div>
      </nav>
      
      <AboutPopup 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
      />
    </>
  );
};

export default Navbar2;
