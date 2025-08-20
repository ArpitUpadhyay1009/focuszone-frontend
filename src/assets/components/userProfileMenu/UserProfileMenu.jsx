import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaLink,
  FaTimes,
  FaCopy,
  FaCog,
  FaTrash,
} from "react-icons/fa";
import "./UserProfileMenu.css";

// Create our own Avatar components directly
const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${
      className || ""
    }`}
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
    className={`flex h-full w-full items-center justify-center rounded-full bg-[#7500CA] ${
      className || ""
    }`}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

const UserProfileMenu = ({
  mobileSidebarMode = false,
  onBack,
  mobileSidebarAvatarOnly = false,
  showSettings,
  setShowSettings,
  showDeleteConfirm,
  setShowDeleteConfirm,
}) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReferralPopup, setShowReferralPopup] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);
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
        return "0h 0m";
      }

      const response = await axios.get(`/api/user-activity/total-time-spent`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.totalTimeSpent !== undefined) {
        const totalSeconds = response.data.totalTimeSpent;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        // Return the data instead of updating state directly
        return `${hours}h ${minutes}m`;
      } else {
        return "0h 0m";
      }
    } catch (error) {
      console.error("Error fetching total focus time:", error.message);
      return "0h 0m";
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return null;
      }

      const response = await axios.get(`/api/user/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        // const totalMinutes = response.data.totalTime || 0; // totalTime is now handled by fetchTotalFocusTime
        // const hours = Math.floor(totalMinutes / 60);
        // const minutes = totalMinutes % 60;

        // Return the data instead of updating state directly
        let coins = response.data.currentCoins || 0;

        if (coins === 0) {
          try {
            const levelResponse = await axios.get("/api/auth/user-level", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (levelResponse.data && levelResponse.data.coins > 0) {
              coins = levelResponse.data.coins;
            }
          } catch (error) {
            console.error("Error fetching user level data:", error);
          }
        }

        return { currentCoins: coins };
      }

      return null;
    } catch (error) {
      console.error("Error fetching user stats:", error.message);
      try {
        const token = localStorage.getItem("token");
        if (!token) return null;

        const levelResponse = await axios.get("/api/auth/user-level", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (levelResponse.data && levelResponse.data.coins !== undefined) {
          return { currentCoins: levelResponse.data.coins };
        }
      } catch (fallbackError) {
        console.error("Error in fallback coin fetch:", fallbackError);
      }

      return null;
    }
  };

  const fetchTotalCoinsEarned = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found for total coins earned");
        return null;
      }

      const response = await axios.get(
        `/api/user-activity/total-coins-earned`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.totalCoinsEarned !== undefined) {
        // Return the data instead of updating state directly
        return { totalCoinsEarned: response.data.totalCoinsEarned };
      } else {
        return { totalCoinsEarned: 0 };
      }
    } catch (error) {
      console.error("Error fetching total coins earned:", error.message);
      return { totalCoinsEarned: 0 };
    }
  };

  const fetchCoinsSpent = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return null;
      }

      const response = await axios.get(`/api/user-activity/coins-spent`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.coinsSpent !== undefined) {
        // Return the data instead of updating state directly
        return response.data.coinsSpent;
      }

      return null;
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
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUserStats(); // Refresh general stats after update
    } catch (error) {
      console.error("Error updating user stats:", error.message);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Run all fetch operations in parallel
        const [
          completedTasksData,
          coinsSpentData,
          userStatsData,
          totalCoinsData,
          totalTimeData,
        ] = await Promise.all([
          fetchCompletedTasks(),
          fetchCoinsSpent(),
          fetchUserStats(),
          fetchTotalCoinsEarned(),
          fetchTotalFocusTime(),
        ]);

        // Update all states after collecting data
        setCompletedTasks(completedTasksData?.tasks || []);
        setUserStats((prev) => ({
          ...prev,
          yourCoins: userStatsData?.currentCoins || prev.yourCoins,
          coinsSpent: coinsSpentData || prev.coinsSpent,
          totalCoinsEarned:
            totalCoinsData?.totalCoinsEarned || prev.totalCoinsEarned,
          totalTime: totalTimeData || prev.totalTime,
          completedTasks:
            completedTasksData?.completedCount || prev.completedTasks,
          intermediateCount:
            completedTasksData?.intermediateCount || prev.intermediateCount,
          totalTaskCount: completedTasksData?.totalCount || prev.totalTaskCount,
        }));
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();

    const handleStatsAndCoinUpdate = async () => {
      console.log(
        "Stats, Coin, or Task update event detected, refreshing stats..."
      ); // Log message updated

      // Run all fetch operations in parallel to reduce total execution time
      const [
        userStatsData,
        coinsSpentData,
        totalCoinsData,
        totalTimeData,
        completedTasksData,
      ] = await Promise.all([
        fetchUserStats(),
        fetchCoinsSpent(),
        fetchTotalCoinsEarned(),
        fetchTotalFocusTime(),
        fetchCompletedTasks(),
      ]);

      // Batch update all state at once to prevent multiple re-renders
      setUserStats((prev) => ({
        ...prev,
        yourCoins: userStatsData?.currentCoins || prev.yourCoins,
        coinsSpent: coinsSpentData || prev.coinsSpent,
        totalCoinsEarned:
          totalCoinsData?.totalCoinsEarned || prev.totalCoinsEarned,
        totalTime: totalTimeData || prev.totalTime,
        completedTasks:
          completedTasksData?.completedCount || prev.completedTasks,
        intermediateCount:
          completedTasksData?.intermediateCount || prev.intermediateCount,
        totalTaskCount: completedTasksData?.totalCount || prev.totalTaskCount,
      }));
    };

    window.addEventListener("coinUpdate", handleStatsAndCoinUpdate);
    window.addEventListener("coinSpent", handleStatsAndCoinUpdate);
    window.addEventListener("statsUpdate", handleStatsAndCoinUpdate);
    window.addEventListener("taskCompletionUpdate", handleStatsAndCoinUpdate); // Add listener for task completion

    // Listen for real-time focus time updates
    const handleFocusTimeTick = (e) => {
      if (e && e.detail && typeof e.detail.totalSeconds === "number") {
        const totalSeconds = e.detail.totalSeconds;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        setUserStats((prev) => ({
          ...prev,
          totalTime: `${hours}h ${minutes}m`,
        }));
      }
    };
    window.addEventListener("focusTimeTick", handleFocusTimeTick);

    return () => {
      window.removeEventListener("coinUpdate", handleStatsAndCoinUpdate);
      window.removeEventListener("coinSpent", handleStatsAndCoinUpdate);
      window.removeEventListener("statsUpdate", handleStatsAndCoinUpdate);
      window.removeEventListener(
        "taskCompletionUpdate",
        handleStatsAndCoinUpdate
      ); // Clean up listener
      window.removeEventListener("focusTimeTick", handleFocusTimeTick);
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

  const handleReferralClick = () => {
    const link = `${window.location.origin}/register`;
    setReferralLink(link);
    setShowReferralPopup(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        toast.success("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy link");
      });
  };

  const shareOnPlatform = (platform) => {
    const message = `Join me on FocusZone! Use my referral link: ${referralLink}`;
    let url = "";

    switch (platform) {
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          referralLink
        )}&quote=${encodeURIComponent(message)}`;
        break;
      case "instagram":
        // Open Instagram's web intent with the referral link in the caption
        url = `https://www.instagram.com/?url=${encodeURIComponent(
          referralLink
        )}`;
        window.location.href = url;
        return;
      default:
        return;
    }

    window.open(url, "_blank", "width=600,height=400");
  };

  // Fetch completed tasks
  const fetchCompletedTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found for completed tasks");
        // setLoading(false); // setLoading is handled in finally
        return {
          tasks: [],
          completedCount: 0,
          intermediateCount: 0,
          totalCount: 0,
        };
      }

      const response = await axios.get(`/api/tasks/completed`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.completedTasks) {
        const tasks = response.data.completedTasks;
        return {
          tasks,
          completedCount: response.data.completedCount || 0,
          intermediateCount: response.data.intermediateCount || 0,
          totalCount: response.data.totalCount || 0,
        };
      } else {
        return {
          tasks: [],
          completedCount: 0,
          intermediateCount: 0,
          totalCount: 0,
        };
      }
    } catch (error) {
      console.error("Error fetching completed tasks:", error.message);
      return {
        tasks: [],
        completedCount: 0,
        intermediateCount: 0,
        totalCount: 0,
      };
    } finally {
      setLoading(false);
    }
  };

  // Handle click on completed tasks stat
  const handleCompletedTasksClick = async () => {
    setShowCompletedTasks(true);
    const completedTasksData = await fetchCompletedTasks();
    setCompletedTasks(completedTasksData?.tasks || []);
    setUserStats((prev) => ({
      ...prev,
      completedTasks: completedTasksData?.completedCount || prev.completedTasks,
      intermediateCount:
        completedTasksData?.intermediateCount || prev.intermediateCount,
      totalTaskCount: completedTasksData?.totalCount || prev.totalTaskCount,
    }));
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
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      // Make the API call to delete the account
      const response = await axios.delete("/api/user/delete-account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // Important for sending cookies
      });

      if (response.status === 200) {
        // Clear all authentication state
        localStorage.clear();

        // Clear all cookies
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie =
            name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }

        // Show success message
        toast.success("Account deleted successfully");

        // Use logout from AuthContext to ensure proper cleanup
        await logout();

        // Force redirect to login page
        navigate("/login", { replace: true });

        // Clear browser history to prevent back navigation
        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", () => {
          navigate("/login", { replace: true });
        });
      }
    } catch (error) {
      console.error("Error deleting account:", error);

      // Check if it's a network error or server error
      if (error.response) {
        // Server responded with error status
        const errorMessage =
          error.response.data?.message || "Failed to delete account";
        toast.error(errorMessage);
      } else if (error.request) {
        // Network error
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        // Other error
        toast.error("Failed to delete account. Please try again.");
      }
    }
  };

  if (mobileSidebarAvatarOnly) {
    // Only render the avatar button (for sidebar)
    return (
      <Avatar className="h-10 w-10 cursor-pointer">
        <AvatarImage
          src={user?.photoURL}
          alt={user?.displayName || user?.username || "User"}
        />
        <AvatarFallback className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </AvatarFallback>
      </Avatar>
    );
  }

  if (mobileSidebarMode) {
    // Mobile sidebar overlay mode
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col bg-white dark:bg-gray-900">
        {/* Top bar with back arrow */}
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={onBack}
            className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Back"
          >
            <svg
              className="h-6 w-6 text-gray-700 dark:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Profile
          </span>
        </div>
        {/* Main content (reuse the dropdown content) */}
        <div className="flex-1 overflow-y-auto">
          {/* Render the full profile content as a block (copy from dropdown) */}
          <div className="profile-header p-4 border-b">
            <p className="text-lg font-semibold">
              {user?.username || user?.displayName || "User"}
            </p>
            <p className="text-sm opacity-75">{user?.email}</p>
          </div>
          {showCompletedTasks ? (
            <div className="completed-tasks-container p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium uppercase tracking-wider opacity-75">
                  COMPLETED TASKS
                </h3>
                <button
                  onClick={() => setShowCompletedTasks(false)}
                  className="text-sm text-[#7500CA] hover:underline"
                >
                  Back
                </button>
              </div>
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#7500CA]" />
                </div>
              ) : completedTasks.length > 0 ? (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {completedTasks.map((task) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`task-item p-2 rounded-md flex items-center ${
                        theme === "dark"
                          ? "bg-opacity-20 bg-[#7500CA] border border-[#7500CA] border-opacity-30 text-white"
                          : "bg-opacity-10 bg-[#7500CA] border border-[#7500CA] border-opacity-20 text-gray-800"
                      }`}
                    >
                      <div
                        className={`mr-2 ${
                          theme === "dark"
                            ? "text-purple-300"
                            : "text-[#7500CA]"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">
                          {task.taskName}
                        </p>
                        <div
                          className={`flex justify-between text-xs ${
                            theme === "dark" ? "opacity-80" : "opacity-70"
                          }`}
                        >
                          {task.dueDate && (
                            <span>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          <span>Pomodoros: {task.estimatedPomodoros}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p
                  className={`text-center py-4 text-sm ${
                    theme === "dark" ? "opacity-80" : "opacity-70"
                  }`}
                >
                  No completed tasks found
                </p>
              )}
            </div>
          ) : (
            <div className="stats-container p-4 space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-wider opacity-75">
                YOUR STATS
              </h3>

              <motion.div
                className="stat-item"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="stat-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z"
                      clipRule="evenodd"
                    />
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">TASKS COMPLETED</p>
                  <p className="stat-value">{userStats.completedTasks}</p>
                </div>
              </motion.div>
              {userStats.totalTaskCount !== undefined && (
                <motion.div
                  className="stat-item"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.36 }}
                >
                  <div className="stat-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">TOTAL TASKS</p>
                    <p className="stat-value">{userStats.totalTaskCount}</p>
                  </div>
                </motion.div>
              )}
              {userStats.intermediateCount !== undefined && (
                <motion.div
                  className="stat-item"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.355 }}
                >
                  <div className="stat-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <circle cx="10" cy="10" r="8" fill="#fbbf24" />
                      <text
                        x="10"
                        y="15"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#fff"
                      >
                        I
                      </text>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">INTERMEDIATE TASKS</p>
                    <p className="stat-value">{userStats.intermediateCount}</p>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          <div className="profile-footer p-4 space-y-3 border-t">
            <button
              onClick={handleReferralClick}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <FaLink className="text-white" />
              Invite Friends
            </button>
            <button
              onClick={() => {
                console.log("Settings button clicked");
                setShowSettings(true);
              }}
              className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaCog className="text-white" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Referral Popup */}
          <AnimatePresence>
            {showReferralPopup && (
              <motion.div
                className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-[9999] p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowReferralPopup(false)}
              >
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md relative"
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setShowReferralPopup(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <FaTimes size={20} />
                  </button>

                  <h3 className="text-xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                    Invite Friends
                  </h3>

                  <div className="mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-center">
                      Share your referral link with friends
                    </p>

                    <div className="flex items-center gap-2 mb-6">
                      <input
                        type="text"
                        value={referralLink}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                      <button
                        onClick={copyToClipboard}
                        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title={copied ? "Copied!" : "Copy link"}
                      >
                        {copied ? (
                          <svg
                            className="w-5 h-5 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <FaCopy className="text-gray-700 dark:text-gray-300" />
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => shareOnPlatform("whatsapp")}
                        className="flex flex-col items-center justify-center gap-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <FaWhatsapp size={24} />
                        <span className="text-xs">WhatsApp</span>
                      </button>
                      <button
                        onClick={() => shareOnPlatform("facebook")}
                        className="flex flex-col items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FaFacebook size={24} />
                        <span className="text-xs">Facebook</span>
                      </button>
                      <button
                        onClick={() => shareOnPlatform("instagram")}
                        className="flex flex-col items-center justify-center gap-2 p-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                      >
                        <FaInstagram size={24} />
                        <span className="text-xs">Instagram</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="profile-button flex items-center justify-center rounded-full overflow-hidden transition-all hover:ring-2 hover:ring-[#7500CA] focus:outline-none"
        aria-label="User profile"
      >
        <Avatar className="h-10 w-10 cursor-pointer">
          <AvatarImage
            src={user?.photoURL}
            alt={user?.displayName || user?.username || "User"}
          />
          <AvatarFallback className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
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
            className="profile-dropdown absolute right-0 mt-2 w-64 rounded-lg shadow-lg overflow-hidden z-[9998]"
          >
            <div className="profile-header p-4 border-b">
              <p className="text-lg font-semibold">
                {user?.username || user?.displayName || "User"}
              </p>
              <p className="text-sm opacity-75">{user?.email}</p>
            </div>

            {showCompletedTasks ? (
              <div className="completed-tasks-container p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium uppercase tracking-wider opacity-75">
                    COMPLETED TASKS
                  </h3>
                  <button
                    onClick={() => setShowCompletedTasks(false)}
                    className="text-sm text-[#7500CA] hover:underline"
                  >
                    Back
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#7500CA]" />
                  </div>
                ) : completedTasks.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {completedTasks.map((task) => (
                      <motion.div
                        key={task._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`task-item p-2 rounded-md flex items-center ${
                          theme === "dark"
                            ? "bg-opacity-20 bg-[#7500CA] border border-[#7500CA] border-opacity-30 text-white"
                            : "bg-opacity-10 bg-[#7500CA] border border-[#7500CA] border-opacity-20 text-gray-800"
                        }`}
                      >
                        <div
                          className={`mr-2 ${
                            theme === "dark"
                              ? "text-purple-300"
                              : "text-[#7500CA]"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-medium truncate">
                            {task.taskName}
                          </p>
                          <div
                            className={`flex justify-between text-xs ${
                              theme === "dark" ? "opacity-80" : "opacity-70"
                            }`}
                          >
                            {task.dueDate && (
                              <span>
                                Due:{" "}
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                            <span>Pomodoros: {task.estimatedPomodoros}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p
                    className={`text-center py-4 text-sm ${
                      theme === "dark" ? "opacity-80" : "opacity-70"
                    }`}
                  >
                    No completed tasks found
                  </p>
                )}
              </div>
            ) : (
              <div className="stats-container p-4 space-y-4">
                <h3 className="text-sm font-medium uppercase tracking-wider opacity-75">
                  YOUR STATS
                </h3>

                <motion.div
                  className="stat-item"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="stat-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                        clipRule="evenodd"
                      />
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">COINS SPENT</p>
                    <p className="stat-value">{userStats.coinsSpent}</p>
                  </div>
                </motion.div>

                <motion.div
                  className="stat-item tasks-completed-stat"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  onClick={handleCompletedTasksClick}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="stat-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">TASKS COMPLETED</p>
                    <p className="stat-value">{userStats.completedTasks}</p>
                  </div>
                </motion.div>
              </div>
            )}

            <div className="profile-footer p-4 space-y-3 border-t">
              <button
                onClick={handleReferralClick}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <FaLink className="text-white" />
                Invite Friends
              </button>
              <button
                onClick={() => {
                  console.log("Settings button clicked");
                  setShowSettings(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FaCog className="text-white" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>

            {/* Referral Popup */}
            <AnimatePresence>
              {showReferralPopup && (
                <motion.div
                  className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-[9999] p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowReferralPopup(false)}
                >
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md relative"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setShowReferralPopup(false)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <FaTimes size={20} />
                    </button>

                    <h3 className="text-xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                      Invite Friends
                    </h3>

                    <div className="mb-6">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-center">
                        Share your referral link with friends
                      </p>

                      <div className="flex items-center gap-2 mb-6">
                        <input
                          type="text"
                          value={referralLink}
                          readOnly
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                        <button
                          onClick={copyToClipboard}
                          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          title={copied ? "Copied!" : "Copy link"}
                        >
                          {copied ? (
                            <svg
                              className="w-5 h-5 text-green-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <FaCopy className="text-gray-700 dark:text-gray-300" />
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => shareOnPlatform("whatsapp")}
                          className="flex flex-col items-center justify-center gap-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <FaWhatsapp size={24} />
                          <span className="text-xs">WhatsApp</span>
                        </button>
                        <button
                          onClick={() => shareOnPlatform("facebook")}
                          className="flex flex-col items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <FaFacebook size={24} />
                          <span className="text-xs">Facebook</span>
                        </button>
                        <button
                          onClick={() => shareOnPlatform("instagram")}
                          className="flex flex-col items-center justify-center gap-2 p-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                        >
                          <FaInstagram size={24} />
                          <span className="text-xs">Instagram</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Settings Modal - always at root */}
            <AnimatePresence>
              {showSettings &&
                ((() => {
                  console.log("Settings modal rendered");
                  return null;
                })(),
                (
                  <motion.div
                    className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-[10000] p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowSettings(false)}
                  >
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md relative"
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setShowSettings(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <FaTimes size={20} />
                      </button>
                      <h3 className="text-xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                        Settings
                      </h3>
                      <div className="space-y-4">
                        <button
                          onClick={() => {
                            setShowSettings(false);
                            setShowDeleteConfirm(true);
                          }}
                          className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <FaTrash className="text-white" />
                          Delete Account
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
            </AnimatePresence>

            {/* Delete Confirmation Modal - always at root */}
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div
                  className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-[10000] p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md relative"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <FaTimes size={20} />
                    </button>
                    <h3 className="text-xl font-bold text-center mb-4 text-red-600 dark:text-red-400">
                      Delete Account
                    </h3>
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                        Are you sure you want to delete your account?
                      </p>
                      <p className="text-xs text-red-500 dark:text-red-400 text-center font-medium">
                        This action is irreversible and will permanently delete
                        all your data.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          handleDelete();
                        }}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfileMenu;

UserProfileMenu.SettingsModal = function SettingsModal({
  showSettings,
  setShowSettings,
  setShowDeleteConfirm,
}) {
  if (!showSettings) return null;
  return (
    <motion.div
      className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-[10000] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowSettings(false)}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md relative"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowSettings(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FaTimes size={20} />
        </button>
        <h3 className="text-xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Settings
        </h3>
        <div className="space-y-4">
          <button
            onClick={() => {
              setShowSettings(false);
              setShowDeleteConfirm(true);
            }}
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            <FaTrash className="text-white" />
            Delete Account
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

UserProfileMenu.DeleteConfirmModal = function DeleteConfirmModal({
  showDeleteConfirm,
  setShowDeleteConfirm,
}) {
  const handleDelete = UserProfileMenu._handleDelete;
  if (!showDeleteConfirm) return null;
  return (
    <motion.div
      className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-[10000] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowDeleteConfirm(false)}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md relative"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowDeleteConfirm(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FaTimes size={20} />
        </button>
        <h3 className="text-xl font-bold text-center mb-4 text-red-600 dark:text-red-400">
          Delete Account
        </h3>
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
            Are you sure you want to delete your account?
          </p>
          <p className="text-xs text-red-500 dark:text-red-400 text-center font-medium">
            This action is irreversible and will permanently delete all your
            data.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowDeleteConfirm(false);
              handleDelete();
            }}
            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Handle account deletion
UserProfileMenu._handleDelete = async function handleDelete() {
  try {
    const token = localStorage.getItem("token");

    // Make the API call to delete the account
    const response = await fetch("/api/user/delete-account", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      credentials: "include", // Important for sending cookies
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete account");
    }

    // Clear all local storage and cookies
    localStorage.clear();

    // Clear all cookies
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }

    // Refresh the page to ensure all state is cleared
    window.location.href = "/login";
  } catch (error) {
    console.error("Error deleting account:", error);
    toast.error(error.message || "Failed to delete account. Please try again.");
    // Still ensure we clean up local state even if there's an error
    localStorage.clear();

    // Clear all cookies
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
    window.location.href = "/login";
  }
};
