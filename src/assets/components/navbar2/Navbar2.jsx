import { useState } from "react";
import "./Navbar2.css";
import Logo from "../logo/Logo.jsx";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle.jsx";
import UserProfileMenu from "../userProfileMenu/UserProfileMenu.jsx";
import AboutPopup from "../AboutPopup/AboutPopup.jsx";
import { motion } from "framer-motion";

export const Navbar2 = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // New: control sidebar view ('menu' or 'profile')
  const [mobileSidebarView, setMobileSidebarView] = useState("menu");
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setMobileSidebarView("menu"); // Always reset to menu when opening
  };

  return (
    <>
      <nav className="navbar-container">
        <div className="navbar-left">
          <Logo />
        </div>

        {/* Desktop navbar-right - hidden on tablet and below */}
        <div className="navbar-right hidden md:flex">
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
          <UserProfileMenu
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
          />
        </div>

        {/* Hamburger menu button - shown on tablet and below */}
        <div className="md:hidden">
          <motion.button
            onClick={toggleMobileMenu}
            className="flex items-center justify-center rounded-full h-10 w-10 mx-2 transition-all hover:ring-2 hover:ring-[#7500CA] focus:outline-none bg-[#7500CA] text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Menu"
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </motion.div>
          </motion.button>
        </div>
      </nav>

      {/* Mobile sidebar - shown when hamburger menu is open */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 md:hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sidebar or Profile Popup */}
          {mobileSidebarView === "menu" ? (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-50"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Menu
                  </h2>
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      className="h-5 w-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>
                {/* Menu Items */}
                <div className="flex-1 p-4 space-y-4">
                  {/* User Profile Menu (avatar button to open popup) */}
                  <div className="mb-4 flex items-center justify-start">
                    <motion.button
                      onClick={() => setMobileSidebarView("profile")}
                      className="profile-button flex items-center justify-center rounded-full overflow-hidden transition-all hover:ring-2 hover:ring-[#7500CA] focus:outline-none"
                      aria-label="User profile"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Avatar icon (reuse from UserProfileMenu) */}
                      <UserProfileMenu mobileSidebarAvatarOnly={true} />
                    </motion.button>
                  </div>
                  {/* About Button */}
                  <motion.button
                    onClick={() => {
                      setIsAboutOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-start p-3 rounded-lg bg-[#7500CA] text-white hover:bg-[#6400ae] transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h.01a1 1 0 100-2H10V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    About
                  </motion.button>
                  {/* Dark Mode Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-gray-900 dark:text-white font-medium">
                      Dark Mode
                    </span>
                    <DarkModeToggle />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            // Profile Popup overlay for mobile
            <UserProfileMenu
              mobileSidebarMode={true}
              onBack={() => setMobileSidebarView("menu")}
              showSettings={showSettings}
              setShowSettings={setShowSettings}
              showDeleteConfirm={showDeleteConfirm}
              setShowDeleteConfirm={setShowDeleteConfirm}
            />
          )}
        </motion.div>
      )}

      <AboutPopup isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* Settings Modal - always at root */}
      <UserProfileMenu.SettingsModal
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        setShowDeleteConfirm={setShowDeleteConfirm}
      />
      {/* Delete Confirmation Modal - always at root */}
      <UserProfileMenu.DeleteConfirmModal
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
      />
    </>
  );
};

export default Navbar2;
