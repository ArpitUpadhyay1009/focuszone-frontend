import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
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
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    totalTime: "0h 0m", // This will be updated by fetchTotalFocusTime
    totalCoinsEarned: 0,
    yourCoins: 0,
    coinsSpent: 0,
    completedTasks: 0,
  });

  const fetchTotalFocusTime = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found for total focus time");
        setUserStats(prev => ({ ...prev, totalTime: "0h 0m" }));
        return;
      }

      const response = await axios.get(`/api/user-activity/total-time-spent`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });

      if (response.data && response.data.totalTimeSpent !== undefined) {
        const totalSeconds = response.data.totalTimeSpent;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        setUserStats(prev => ({
          ...prev,
          totalTime: `${hours}h ${minutes}m`
        }));
      } else {
        setUserStats(prev => ({ ...prev, totalTime: "0h 0m" }));
      }
    } catch (error) {
      console.error("Error fetching total focus time:", error.message);
      setUserStats(prev => ({ ...prev, totalTime: "0h 0m" }));
    }
  };
  
  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
  
      const response = await axios.get(`/api/user/stats`, { 
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
  
      if (response.data) {
        // const totalMinutes = response.data.totalTime || 0; // totalTime is now handled by fetchTotalFocusTime
        // const hours = Math.floor(totalMinutes / 60);
        // const minutes = totalMinutes % 60;
        
        setUserStats(prev => ({ 
          ...prev,
          // totalTime: `${hours}h ${minutes}m`, // Removed, handled by fetchTotalFocusTime
          yourCoins: response.data.currentCoins || 0,
          // completedTasks: response.data.completedTasksCount || 0, // Removed: fetchCompletedTasks will handle this
        }));
        
        if (response.data.currentCoins === 0) {
          try {
            const levelResponse = await axios.get("/api/auth/user-level", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            
            if (levelResponse.data && levelResponse.data.coins > 0) {
              setUserStats(prev => ({
                ...prev,
                yourCoins: levelResponse.data.coins
              }));
            }
          } catch (error) {
            console.error("Error fetching user level data:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user stats:", error.message);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const levelResponse = await axios.get("/api/auth/user-level", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (levelResponse.data && levelResponse.data.coins !== undefined) {
          setUserStats(prev => ({
            ...prev,
            yourCoins: levelResponse.data.coins
          }));
        }
      } catch (fallbackError) {
        console.error("Error in fallback coin fetch:", fallbackError);
      }
    }
  };

  const fetchTotalCoinsEarned = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found for total coins earned");
        return;
      }

      const response = await axios.get(`/api/user-activity/total-coins-earned`, { 
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });

      if (response.data && response.data.totalCoinsEarned !== undefined) {
        setUserStats(prev => ({
          ...prev,
          totalCoinsEarned: response.data.totalCoinsEarned
        }));
      } else {
        setUserStats(prev => ({
            ...prev,
            totalCoinsEarned: 0 
          }));
      }
    } catch (error) {
      console.error("Error fetching total coins earned:", error.message);
      setUserStats(prev => ({
        ...prev,
        totalCoinsEarned: 0 
      }));
    }
  };

  const fetchCoinsSpent = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
  
      const response = await axios.get(`/api/user-activity/coins-spent`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
  
      if (response.data && response.data.coinsSpent !== undefined) {
        setUserStats(prev => ({
          ...prev,
          coinsSpent: response.data.coinsSpent
        }));
        return response.data.coinsSpent;
      }
    } catch (error) {
      console.error("Error fetching coins spent:", error.message);
      return null;
    }
  };

  // Update user stats in the database (This seems to be for general stats, not total time)
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
      
      fetchUserStats(); // Refresh general stats after update
    } catch (error) {
      console.error("Error updating user stats:", error.message);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchCompletedTasks();
        await fetchCoinsSpent();
        await fetchUserStats(); 
        await fetchTotalCoinsEarned(); 
        await fetchTotalFocusTime(); 
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };
    
    initializeData();
    
    const handleStatsAndCoinUpdate = async () => {
      console.log("Stats, Coin, or Task update event detected, refreshing stats..."); // Log message updated
      await fetchUserStats();
      await fetchCoinsSpent();
      await fetchTotalCoinsEarned();
      await fetchTotalFocusTime(); 
      await fetchCompletedTasks(); // Add this to refresh completed tasks count
    };
    
    window.addEventListener('coinUpdate', handleStatsAndCoinUpdate);
    window.addEventListener('coinSpent', handleStatsAndCoinUpdate); 
    window.addEventListener('statsUpdate', handleStatsAndCoinUpdate); 
    window.addEventListener('taskCompletionUpdate', handleStatsAndCoinUpdate); // Add listener for task completion
    
    return () => {
      window.removeEventListener('coinUpdate', handleStatsAndCoinUpdate);
      window.removeEventListener('coinSpent', handleStatsAndCoinUpdate);
      window.removeEventListener('statsUpdate', handleStatsAndCoinUpdate);
      window.removeEventListener('taskCompletionUpdate', handleStatsAndCoinUpdate); // Clean up listener
    };
  }, []);

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
        console.error("No token found for completed tasks");
        setCompletedTasks([]); // Clear the list of tasks
        setUserStats(prev => ({ ...prev, completedTasks: 0 })); // Reset count in userStats
        // setLoading(false); // setLoading is handled in finally
        return 0; // Return a value for consistency or handle as needed
      }

      const response = await axios.get(`/api/tasks/completed`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });

      if (response.data && response.data.completedTasks) {
        const tasks = response.data.completedTasks;
        setCompletedTasks(tasks); // This state is for displaying the list of tasks
        
        const compTasksCount = tasks.length; // Calculate the number of completed tasks
        setUserStats(prev => ({
          ...prev,
          completedTasks: compTasksCount // Update the count in userStats
        }));
        
        return compTasksCount;
      } else {
        setCompletedTasks([]);
        setUserStats(prev => ({
          ...prev,
          completedTasks: 0
        }));
        
        return 0;
      }
    } catch (error) {
      console.error("Error fetching completed tasks:", error.message);
      setCompletedTasks([]);
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
  }, []); // Note: This useEffect is separate and for UI behavior, which is fine.
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action is irreversible.')) return;

    try {
      const token = localStorage.getItem('token');

      await axios.delete('/api/user/delete-account', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Clear auth tokens
      localStorage.removeItem('token');

      // Optional: callback to redirect to homepage/login
      handleLogout();

    } catch (error) {
      alert('Failed to delete account. Please try again.');
      console.error(error);
    }
  };

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
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
      Delete My Account
    </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfileMenu;
