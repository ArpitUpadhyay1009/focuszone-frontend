import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext"; // Add this import
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./UserProfileMenu.css";

// Create our own Avatar components directly
const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className || ""}`}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={`aspect-square h-full w-full ${className || ""}`}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={`flex h-full w-full items-center justify-center rounded-full bg-[#7500CA] ${className || ""}`}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

const UserProfileMenu = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme(); // Add this line to get the current theme
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    totalTime: "0h 0m",
    totalCoinsEarned: 0,
    yourCoins: 0,
    coinsSpent: 0,
    completedTasks: 0,
  });
  

  // Fetch user stats from the backend
  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
  
      // Initialize default stats
      let stats = {
        totalTime: "0h 0m",
        totalCoinsEarned: 0,
        yourCoins: 0,
        coinsSpent: 0,
        completedTasks: 0,
      };
      
      // Try to fetch user activity data first
      try {
        const activityResponse = await axios.get(`/api/user-activity`, {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
        
        if (activityResponse.data) {
          console.log("User activity data:", activityResponse.data);
          
          // Format the time from minutes to hours and minutes
          const totalMinutes = activityResponse.data.totalTimeSpent || 0;
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          
          stats = {
            ...stats,
            totalTime: `${hours}h ${minutes}m`,
            totalCoinsEarned: activityResponse.data.totalCoinsEarned || 0,
            coinsSpent: activityResponse.data.coinsSpent || 0,
          };
        }
      } catch (activityError) {
        console.error("Error fetching user activity:", activityError.message);
      }
      
      // Try to fetch user level data for coins
      try {
        const levelResponse = await axios.get("/api/auth/user-level", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (levelResponse.data && levelResponse.data.coins !== undefined) {
          stats.yourCoins = levelResponse.data.coins;
          console.log("User coins from level data:", levelResponse.data.coins);
        }
      } catch (levelError) {
        console.error("Error fetching user level data:", levelError.message);
      }
      
      // Update the state with all collected data
      setUserStats(stats);
      
    } catch (error) {
      console.error("Error in fetchUserStats:", error.message);
    }
  };

  // Update user stats in the database
  const updateUserStats = async (statsData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      await axios.post(`/api/user/stats/update`, statsData, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      // Refresh stats after update
      fetchUserStats();
    } catch (error) {
      console.error("Error updating user stats:", error.message);
    }
  };

  // Fetch stats when component mounts
  useEffect(() => {
    fetchUserStats();
    // Also fetch completed tasks count on mount
    fetchCompletedTasks();
    
    // Add event listeners for real-time coin updates
    const handleCoinUpdate = () => {
      console.log("Coin update event detected, refreshing stats...");
      fetchUserStats();
    };
    
    // Listen for the same event that UpgradeCard uses
    window.addEventListener('coinUpdate', handleCoinUpdate);
    
    // Clean up event listeners when component unmounts
    return () => {
      window.removeEventListener('coinUpdate', handleCoinUpdate);
    };
  }, []);

  // Example function to update stats (can be called from timer completion, coin transactions, etc.)
  const handleStatsUpdate = (type, value) => {
    const statsUpdate = {};
    
    switch(type) {
      case 'time':
        statsUpdate.timeSpent = value; // value in minutes
        break;
      case 'coinsEarned':
        statsUpdate.coinsEarned = value;
        break;
      case 'coinsSpent':
        statsUpdate.coinsSpent = value;
        break;
      default:
        return;
    }
    
    updateUserStats(statsUpdate);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", () => {
      navigate("/login", { replace: true });
    });
  };

  // Fetch completed tasks
  const fetchCompletedTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const response = await axios.get(`/api/tasks/completed`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });

      if (response.data && response.data.completedTasks) {
        const tasks = response.data.completedTasks;
        setCompletedTasks(tasks);
        
        // Calculate and store the number of completed tasks
        const compTasks = tasks.length;
        console.log("Number of completed tasks:", compTasks);
        
        // Update the userStats with the accurate count
        setUserStats(prev => ({
          ...prev,
          completedTasks: compTasks
        }));
        
        // Also fetch this count on initial load
        return compTasks;
      } else {
        setCompletedTasks([]);
        const compTasks = 0;
        
        // Update userStats with zero completed tasks
        setUserStats(prev => ({
          ...prev,
          completedTasks: 0
        }));
        
        return 0;
      }
    } catch (error) {
      console.error("Error fetching completed tasks:", error.message);
      setCompletedTasks([]);
      
      // Set completedTasks to 0 in case of error
      setUserStats(prev => ({
        ...prev,
        completedTasks: 0
      }));
      
      return 0;
    } finally {
      setLoading(false);
    }
  };

  // Handle click on completed tasks stat
  const handleCompletedTasksClick = () => {
    setShowCompletedTasks(true);
    fetchCompletedTasks();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowCompletedTasks(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="profile-button flex items-center justify-center rounded-full overflow-hidden transition-all hover:ring-2 hover:ring-[#7500CA] focus:outline-none"
        aria-label="User profile"
      >
        <Avatar className="h-10 w-10 cursor-pointer">
          <AvatarImage src={user?.photoURL} alt={user?.displayName || user?.username || "User"} />
          <AvatarFallback className="text-white">
            {/* Profile icon instead of initials */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </AvatarFallback>
        </Avatar>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="profile-dropdown absolute right-0 mt-2 w-64 rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="profile-header p-4 border-b">
              <p className="text-lg font-semibold">{user?.username || user?.displayName || "User"}</p>
              <p className="text-sm opacity-75">{user?.email}</p>
            </div>

            {showCompletedTasks ? (
              <div className="completed-tasks-container p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium uppercase tracking-wider opacity-75">COMPLETED TASKS</h3>
                  <button 
                    onClick={() => setShowCompletedTasks(false)}
                    className="text-sm text-[#7500CA] hover:underline"
                  >
                    Back
                  </button>
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#7500CA]"></div>
                  </div>
                ) : completedTasks.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {completedTasks.map((task) => (
                      <motion.div 
                        key={task._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`task-item p-2 rounded-md flex items-center ${
                          theme === 'dark' 
                            ? 'bg-opacity-20 bg-[#7500CA] border border-[#7500CA] border-opacity-30 text-white' 
                            : 'bg-opacity-10 bg-[#7500CA] border border-[#7500CA] border-opacity-20 text-gray-800'
                        }`}
                      >
                        <div className={`mr-2 ${theme === 'dark' ? 'text-purple-300' : 'text-[#7500CA]'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-medium truncate">{task.taskName}</p>
                          <div className={`flex justify-between text-xs ${theme === 'dark' ? 'opacity-80' : 'opacity-70'}`}>
                            {task.dueDate && (
                              <span>
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                            <span>
                              Pomodoros: {task.estimatedPomodoros}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-center py-4 text-sm ${theme === 'dark' ? 'opacity-80' : 'opacity-70'}`}>
                    No completed tasks found
                  </p>
                )}
              </div>
            ) : (
              <div className="stats-container p-4 space-y-4">
                <h3 className="text-sm font-medium uppercase tracking-wider opacity-75">YOUR STATS</h3>
                
                <motion.div 
                  className="stat-item"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="stat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">TOTAL FOCUS TIME</p>
                    <p className="stat-value">{userStats.totalTime}</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="stat-item"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="stat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">TOTAL COINS EARNED</p>
                    <p className="stat-value">{userStats.totalCoinsEarned}</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="stat-item"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <div className="stat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">YOUR COINS</p>
                    <p className="stat-value">{userStats.yourCoins}</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="stat-item"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="stat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">COINS SPENT</p>
                    <p className="stat-value">{userStats.coinsSpent}</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="stat-item"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  onClick={handleCompletedTasksClick}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="stat-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">TASKS COMPLETED</p>
                    <p className="stat-value">{userStats.completedTasks}</p>
                  </div>
                </motion.div>
              </div>
            )}

            <div className="profile-footer p-2 border-t">
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm rounded-md hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-300 transition-colors"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfileMenu;