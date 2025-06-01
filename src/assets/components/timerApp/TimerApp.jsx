import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Timer, Pause, RefreshCcw, Settings, X, Coins } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { useTheme } from "../../context/ThemeContext.jsx";
import "./TimerApp.css";
import { motion, AnimatePresence } from "framer-motion";

export default function TimerApp({ setParentPopupState }) {
  // Add timestamp tracking for accurate timing across tab switches and page reloads
  const [timerStartedAt, setTimerStartedAt] = useState(() => {
    return localStorage.getItem('timerStartedAt') ? parseInt(localStorage.getItem('timerStartedAt')) : null;
  });
  
  const [mode, setMode] = useState(() => localStorage.getItem('timerMode') || "pomodoro");
  const [time, setTime] = useState(() => {
    const savedTime = localStorage.getItem('timerTime');
    return savedTime ? parseInt(savedTime) : 25 * 60;
  });
  const [isRunning, setIsRunning] = useState(() => {
    return localStorage.getItem('timerIsRunning') === 'true';
  });
  const [showStart, setShowStart] = useState(() => {
    return localStorage.getItem('timerShowStart') !== 'false';
  });
  const [pomodoroTime, setPomodoroTime] = useState(() => {
    const saved = localStorage.getItem('timerPomodoroTime');
    return saved ? parseInt(saved) : 25 * 60;
  });
  const [breakTime, setBreakTime] = useState(() => {
    const saved = localStorage.getItem('timerBreakTime');
    return saved ? parseInt(saved) : 5 * 60;
  });
  const [cycles, setCycles] = useState(() => {
    const saved = localStorage.getItem('timerCycles');
    return saved ? parseInt(saved) : 1;
  });
  const [currentCycle, setCurrentCycle] = useState(() => {
    const saved = localStorage.getItem('timerCurrentCycle');
    return saved ? parseInt(saved) : 0;
  });
  const [isBreak, setIsBreak] = useState(() => {
    return localStorage.getItem('timerIsBreak') === 'true';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [countdownTime, setCountdownTime] = useState(() => {
    const saved = localStorage.getItem('timerCountdownTime');
    return saved ? parseInt(saved) : 5 * 60;
  });
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('timerCoins');
    return saved ? parseFloat(saved) : 0;
  });
  // Track the initial time when timer starts to calculate elapsed minutes correctly
  const [initialTime, setInitialTime] = useState(null);
  // Track minutes elapsed to avoid awarding coins multiple times
  const [minutesElapsed, setMinutesElapsed] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState(() => {
    return localStorage.getItem('timerPauseStartTime') ? parseInt(localStorage.getItem('timerPauseStartTime')) : null;
  });
  const [totalPausedTime, setTotalPausedTime] = useState(() => {
    const saved = localStorage.getItem('timerTotalPausedTime');
    return saved ? parseInt(saved) : 0;
  });
  const [lastSavedTimeOnReset, setLastSavedTimeOnReset] = useState(0); // To track time for reset

  const notificationSound = new Audio("/notification.mp3");

  const { theme } = useTheme();

  // Function to save time spent to the database
  const saveTimeSpentToDatabase = async (timeSpentInSecondsValue) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, user might not be logged in");
        return;
      }
      // Ensure we are not sending zero or negative values, unless it's a specific reset scenario (which we handle separately)
      if (typeof timeSpentInSecondsValue !== 'number' || timeSpentInSecondsValue <= 0) {
        console.warn("Invalid or zero timeSpentInSecondsValue, not saving:", timeSpentInSecondsValue);
        return;
      }

      console.log(`Attempting to save ${timeSpentInSecondsValue} seconds.`);
      const response = await axios.post(
        "/api/user-activity/update-time-spent", 
        { timeSpentInSeconds: timeSpentInSecondsValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Time spent saved:", response.data);
      // Dispatch an event to notify UserProfileMenu to refresh stats
      window.dispatchEvent(new Event("statsUpdate")); 
      return response.data;
    } catch (error) {
      console.error(
        "Error saving time spent:",
        error.response?.data || error.message
      );
    }
  };

  // Format time function
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Save all state changes to localStorage
  useEffect(() => {
    localStorage.setItem('timerMode', mode);
    localStorage.setItem('timerTime', time.toString());
    localStorage.setItem('timerIsRunning', isRunning.toString());
    localStorage.setItem('timerShowStart', showStart.toString());
    localStorage.setItem('timerPomodoroTime', pomodoroTime.toString());
    localStorage.setItem('timerBreakTime', breakTime.toString());
    localStorage.setItem('timerCycles', cycles.toString());
    localStorage.setItem('timerCurrentCycle', currentCycle.toString());
    localStorage.setItem('timerIsBreak', isBreak.toString());
    localStorage.setItem('timerCountdownTime', countdownTime.toString());
    localStorage.setItem('timerCoins', coins.toString());
    localStorage.setItem('timerTotalPausedTime', totalPausedTime.toString());
    
    if (timerStartedAt) {
      localStorage.setItem('timerStartedAt', timerStartedAt.toString());
    } else {
      localStorage.removeItem('timerStartedAt');
    }
    if (pauseStartTime) {
      localStorage.setItem('timerPauseStartTime', pauseStartTime.toString());
    } else {
      localStorage.removeItem('timerPauseStartTime');
    }
  }, [
    mode, time, isRunning, showStart, pomodoroTime, breakTime, 
    cycles, currentCycle, isBreak, countdownTime, coins, timerStartedAt,
    totalPausedTime, pauseStartTime // Added new state variables to dependency array
  ]);

  // Function to save coins to the database
  const saveCoinsToDatabase = async (earnedCoins) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, user might not be logged in");
        return;
      }

      const response = await axios.post(
        "/api/auth/save-coin",
        { coins: earnedCoins },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Coins saved:", response.data);

      // Dispatch a custom event to notify other components that coins have been updated
      window.dispatchEvent(new Event("coinUpdate"));

      return response.data;
    } catch (error) {
      console.error(
        "Error saving coins:",
        error.response?.data || error.message
      );
    }
  };

  // When page loads, recalculate time based on when timer was started
  useEffect(() => {
    if (isRunning && timerStartedAt) {
      const now = Date.now();
      const elapsedSecondsWhileAway = Math.floor((now - timerStartedAt) / 1000);
      
      if (mode === "stopwatch") {
        setTime(prevTime => prevTime + elapsedSecondsWhileAway);
      } else { // For countdown and pomodoro
        const currentTimeSnapshot = time; // Capture current time before any async updates
        const remainingTimeAfterAway = currentTimeSnapshot - elapsedSecondsWhileAway;
        
        if (remainingTimeAfterAway <= 0) {
          // Timer completed while away
          setTime(0);
          setIsRunning(false); 
          setShowStart(true);
          notificationSound.play().catch(e => console.log("Error playing sound:", e));

          if (mode === "pomodoro") {
            if (!isBreak) {
              console.log(`Pomodoro session finished while away. Elapsed: ${elapsedSecondsWhileAway}s, Original Pomodoro Time: ${pomodoroTime}s`);
              // Save the actual pomodoroTime, not elapsedSecondsWhileAway if it's longer
              saveTimeSpentToDatabase(pomodoroTime); 
              if (pomodoroTime >= 60) { 
                saveCoinsToDatabase(0.5); 
                setCoins(prev => prev + 0.5);
              }

              if (currentCycle + 1 < cycles) {
                setCurrentCycle(prev => prev + 1);
                setIsBreak(true);
                setTime(breakTime);
              } else {
                console.log("All Pomodoro cycles completed while away.");
                setParentPopupState(true); 
                resetTimer(); 
              }
            } else {
              // Break finished while away
              console.log("Break finished while away.");
              setIsBreak(false);
              // setCurrentCycle(prev => prev + 1); // This was potentially problematic if resetTimer is called next
              // Let resetTimer handle currentCycle or ensure correct order if transitioning to next pomodoro
              if (currentCycle +1 < cycles) { // Check if it was the last break before final pomodoro
                setCurrentCycle(prev => prev + 1);
                setTime(pomodoroTime);
                 // Decide if next pomodoro should auto-start
                 // setIsRunning(true);
                 // setTimerStartedAt(Date.now());
              } else {
                console.log("All cycles and final break completed while away.");
                setParentPopupState(true);
                resetTimer();
              }
            }
          }
          // Clear timerStartedAt from localStorage as the session effectively ended or transitioned
          localStorage.removeItem('timerStartedAt');
        } else {
          // Timer did NOT complete while away, just update the time
          setTime(remainingTimeAfterAway);
          // Save the partial time elapsed while away if it's a pomodoro session
          if (mode === "pomodoro" && !isBreak && elapsedSecondsWhileAway > 0) {
            saveTimeSpentToDatabase(elapsedSecondsWhileAway);
            // Award coins for minutes elapsed while away (for this partial, non-completed segment)
            const minutesPassedWhileAway = Math.floor(elapsedSecondsWhileAway / 60);
            if (minutesPassedWhileAway > 0) {
              const newCoins = minutesPassedWhileAway * 0.5; 
              saveCoinsToDatabase(newCoins);
              setCoins(prev => prev + newCoins);
              setMinutesElapsed(prev => prev + minutesPassedWhileAway);
            }
          }
          // If timer is still running and was running from localStorage, ensure timerStartedAt is updated for the main timer
          // This might already be handled by the main timer's logic or visibility change handler
          // For now, we assume the main timer will pick up the new 'time' and 'isRunning' state correctly.
        }
      }
    }
  }, []); // Empty dependency array means this runs once on mount/load

  // Main timer effect - using requestAnimationFrame for better accuracy
  useEffect(() => {
    let animationFrameId;
    let lastUpdateTime = null;
    
    const updateTimer = () => {
      const now = Date.now();
      
      // Initialize lastUpdateTime on first run
      if (!lastUpdateTime) {
        lastUpdateTime = now;
      }
      
      // Calculate elapsed time since last update
      const deltaTime = now - lastUpdateTime;
      
      // Update time every second (1000ms)
      if (deltaTime >= 1000) {
        const secondsToUpdate = Math.floor(deltaTime / 1000);
        lastUpdateTime = now - (deltaTime % 1000); // Keep remainder for accuracy
        
        setTime(prevTime => {
          // For stopwatch, add elapsed time
          if (mode === "stopwatch") {
            setLastSavedTimeOnReset(prev => prev + secondsToUpdate); // Track time for reset
            return prevTime + secondsToUpdate;
          }
          
          // For countdown and pomodoro, subtract elapsed time
          const newTime = Math.max(0, prevTime - secondsToUpdate);
          
          if (mode === "pomodoro" && !isBreak && prevTime > newTime) {
             // Increment time for reset only when pomodoro is active and time is decreasing
            setLastSavedTimeOnReset(prev => prev + (prevTime - newTime)); 
          }

          // Handle timer completion
          if (newTime === 0 && prevTime > 0) {
            notificationSound.play();
            
            if (mode === "countdown") {
              setIsRunning(false);
              setShowStart(true);
              return 0;
            }

            if (mode === "pomodoro" && !isBreak) {
              if (currentCycle + 1 < cycles) {
                setIsBreak(true);
                // Only award coins if the timer ran for at least 1 minute
                if (initialTime && (initialTime - newTime) >= 60) { // newTime is 0 here
                  console.log("Awarding 0.5 coins for pomodoro cycle completion (visible)");
                  saveCoinsToDatabase(0.5); 
                  setCoins((prevCoins) => prevCoins + 0.5); 
                  saveTimeSpentToDatabase(pomodoroTime); 
                  setLastSavedTimeOnReset(0); // Reset after saving full pomodoro
                }
                return breakTime;
              } else { // This is the final cycle
                setIsRunning(false);
                setShowStart(true);
                // Only award coins if the timer ran for at least 1 minute
                if (initialTime && (initialTime - newTime) >= 60) { // newTime is 0 here
                  console.log("Awarding 0.5 coins for final pomodoro cycle completion (visible)");
                  saveCoinsToDatabase(0.5); 
                  setCoins((prevCoins) => prevCoins + 0.5); 
                }
                
                // Save time for the final cycle
                saveTimeSpentToDatabase(pomodoroTime);
                setLastSavedTimeOnReset(0); // Reset after saving full pomodoro

                // Auto reset after a short delay when all cycles are completed
                setTimeout(() => {
                  resetTimer();
                  setCoins(0); // Explicitly reset coins display
                }, 2000);

                return 0;
              }
            } else if (mode === "pomodoro" && isBreak) {
              setIsBreak(false);
              setCurrentCycle((prev) => prev + 1);
              return pomodoroTime;
            }
          }
          
          // Award coins for each minute in pomodoro mode
          if (mode === "pomodoro" && !isBreak && initialTime) {
            // Calculate total minutes elapsed since timer started
            const totalMinutesElapsed = Math.floor((initialTime - newTime) / 60);
            
            // Only award coins when crossing a new minute threshold and at least 1 minute has passed
            if (totalMinutesElapsed > minutesElapsed && totalMinutesElapsed > 0) {
              const newCoins = 0.5; // Award 0.5 coins for the elapsed minute when visible
              console.log(`Awarding ${newCoins} coins for minute ${totalMinutesElapsed} (visible)`);
              saveCoinsToDatabase(newCoins);
              setCoins(prev => prev + newCoins);
              setMinutesElapsed(totalMinutesElapsed);
            }
          }
          
          return newTime;
        });
      }
      
      // Continue the animation loop if timer is running
      if (isRunning) {
        animationFrameId = requestAnimationFrame(updateTimer);
      }
    };
    
    // Start the animation loop if timer is running
    if (isRunning) {
      // Initialize or update the timer start timestamp
      if (!timerStartedAt) {
        setTimerStartedAt(Date.now());
      }
      
      lastUpdateTime = Date.now();
      animationFrameId = requestAnimationFrame(updateTimer);
    }
    
    // Cleanup function
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRunning, mode, isBreak, cycles, currentCycle, pomodoroTime, breakTime, timerStartedAt, initialTime, minutesElapsed]);

  // Enhanced visibility change handler to work with requestAnimationFrame
  useEffect(() => {
    let visibilityChangeTime = null;
    
    const handleVisibilityChange = () => {
      const now = Date.now();
      
      if (document.visibilityState === 'hidden') {
        // Store the time when the tab became hidden
        visibilityChangeTime = now;
      } else if (document.visibilityState === 'visible' && isRunning) {
        // Tab is visible again and timer was running
        if (visibilityChangeTime) {
          const hiddenDuration = now - visibilityChangeTime;
          
          // Only update if the tab was hidden for a significant amount of time
          if (hiddenDuration > 1000) {
            if (mode === "stopwatch") {
              // For stopwatch, add the elapsed time
              const elapsedSeconds = Math.floor(hiddenDuration / 1000);
              setTime(prevTime => prevTime + elapsedSeconds);
            } else {
              // For countdown and pomodoro, calculate what the time should be now
              const elapsedSeconds = Math.floor(hiddenDuration / 1000);
              
              setTime(prevTime => {
                const newTime = Math.max(0, prevTime - elapsedSeconds);
                
                // Handle timer completion if it should have completed while hidden
                if (newTime === 0 && prevTime > 0) {
                  // Timer completed while tab was hidden
                  if (mode === "pomodoro" && !isBreak) {
                    // Award coins for completed pomodoro
                    const newCoins = Math.floor((initialTime || pomodoroTime) / 60) * 1; // Ensure 1 coin per minute
                    saveCoinsToDatabase(newCoins);
                    setCoins(prev => prev + newCoins);
                    saveTimeSpentToDatabase(pomodoroTime); // Save full pomodoro duration
                    
                    // Handle cycle completion
                    if (currentCycle < cycles - 1) {
                      setIsBreak(true);
                      return breakTime;
                    } else {
                      // All cycles completed
                      setIsRunning(false);
                      setShowStart(true);
                      setIsBreak(false);
                      setCurrentCycle(0);
                      return pomodoroTime;
                    }
                  } else if (mode === "pomodoro" && isBreak) {
                    // Break completed
                    setIsBreak(false);
                    setCurrentCycle(prev => prev + 1);
                    return pomodoroTime;
                  } else {
                    // Countdown completed
                    setIsRunning(false);
                    setShowStart(true);
                    return 0;
                  }
                }
                
                return newTime;
              });
              
              // Update minutes elapsed for coin calculation
              if (mode === "pomodoro" && !isBreak && initialTime) {
                const totalElapsedTime = initialTime - time + elapsedSeconds;
                const totalMinutesElapsed = Math.floor(totalElapsedTime / 60);
                
                if (totalMinutesElapsed > minutesElapsed) {
                  const newCoinsToAdd = (totalMinutesElapsed - minutesElapsed) * 1; // Ensure 1 coin per minute
                  saveCoinsToDatabase(newCoinsToAdd);
                  setCoins(prev => prev + newCoinsToAdd);
                  setMinutesElapsed(totalMinutesElapsed);
                  // Time is saved upon full cycle completion, not per minute for hidden state to keep it simple
                }
              }
            }
            
            // Update the timer start timestamp to now
            setTimerStartedAt(now);
          }
        }
        
        visibilityChangeTime = null;
      }
    };
    
    // Use both visibilitychange and focus/blur events for better cross-browser support
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    window.addEventListener('blur', () => {
      visibilityChangeTime = Date.now();
    });
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      window.removeEventListener('blur', () => {});
    };
  }, [isRunning, mode, isBreak, time, initialTime, pomodoroTime, breakTime, cycles, currentCycle, minutesElapsed]);

  const startTimer = () => {
    setIsRunning(true);
    setShowStart(false);
    
    if (pauseStartTime) {
      const currentPauseDuration = Date.now() - pauseStartTime;
      setTotalPausedTime(prev => prev + currentPauseDuration);
      setPauseStartTime(null);
    }
    
    // Start timer with 1 second less to avoid immediate coin award
    if (mode === "pomodoro" && !isBreak && time === pomodoroTime) {
      setTime(prevTime => Math.max(0, prevTime - 1));
    }
    
    setTimerStartedAt(Date.now());
    setInitialTime(time);
    setMinutesElapsed(0);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setShowStart(true);
    setTimerStartedAt(null);
    setPauseStartTime(Date.now()); // Record pause start time
  };

  const resetTimer = (newMode = null) => {
    setIsRunning(false);
    setTimerStartedAt(null); // Reset the timer start time

    // Save any accumulated time from lastSavedTimeOnReset before resetting
    if (lastSavedTimeOnReset > 0) { 
      saveTimeSpentToDatabase(lastSavedTimeOnReset); // Corrected: save seconds directly
      setLastSavedTimeOnReset(0); // Reset after saving
    }
    setShowStart(true);
    setIsBreak(false);
    setCurrentCycle(0);
    // timerStartedAt is already set to null above
    setInitialTime(null);
    setMinutesElapsed(0);
    setPauseStartTime(null); // Reset pause start time
    setTotalPausedTime(0); // Reset total paused time
    
    // Ensure pomodoroTime, countdownTime have valid defaults if not loaded from settings
    // This is more of a general robustness check for your settings logic.
    // For now, we assume pomodoroTime and countdownTime are correctly populated from state.
    if (mode === "pomodoro") setTime(pomodoroTime || 25 * 60); // Fallback if pomodoroTime is 0/null
    if (mode === "countdown") setTime(countdownTime || 10 * 60); // Fallback if countdownTime is 0/null
    if (mode === "stopwatch") setTime(0);
    setCoins(0);
    
    window.dispatchEvent(new Event("coinUpdate"));
  };

  // Update handleModeChange to work with timestamps
  const handleModeChange = (newMode) => {
    // Pause current timer
    setIsRunning(false);
    setShowStart(true);
    setTimerStartedAt(null);
    setInitialTime(null);
    setMinutesElapsed(0);
    
    // Set new mode
    setMode(newMode);
    
    // Set appropriate time for the new mode
    if (newMode === "pomodoro") {
      setTime(pomodoroTime);
      setIsBreak(false);
      setCurrentCycle(0);
    } else if (newMode === "countdown") {
      setTime(countdownTime);
    } else if (newMode === "stopwatch") {
      setTime(0);
    }
  };

  const saveSettings = () => {
    setIsSettingsOpen(false);
    if (mode === "pomodoro") setTime(pomodoroTime);
    if (mode === "countdown") setTime(countdownTime);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-8 rounded-2xl shadow-lg w-full max-w-[450px] mx-auto text-center relative transition-colors duration-300 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center",
        minHeight: "350px",
        margin: "0 auto",
        padding: "32px 24px"
      }}
    >
      {/* Mode selector with improved styling */}
      <motion.div
        className="flex justify-between border border-[#7500CA] rounded-full p-1 mb-4 md:mb-6 w-full"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          className={`flex-1 px-3 py-1 md:px-5 md:py-3 text-sm md:text-base rounded-full transition-all duration-300 min-w-[90px] md:min-w-[110px] ${
            isBreak
              ? "bg-gray-300 text-gray-700"
              : mode === "pomodoro"
              ? "bg-[#FFE3A6] text-black"
              : theme === "dark"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleModeChange("pomodoro")}
          whileHover={{ y: -2 }}
          whileTap={{ y: 1 }}
          transition={{ duration: 0 }}
        >
          {isBreak ? "Break" : "Pomodoro"}
        </motion.button>
        <motion.button
          className={`flex-1 px-3 py-1 md:px-5 md:py-3 text-sm md:text-base rounded-full transition-all duration-300 min-w-[90px] md:min-w-[110px] ${
            mode === "countdown"
              ? "bg-[#FFE3A6] text-black"
              : theme === "dark"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleModeChange("countdown")}
          whileHover={{ y: -2 }}
          whileTap={{ y: 1 }}
          transition={{ duration: 0 }}
        >
          Countdown
        </motion.button>
        <motion.button
          className={`flex-1 px-3 py-1 md:px-5 md:py-3 text-sm md:text-base rounded-full transition-all duration-300 min-w-[90px] md:min-w-[110px] ${
            mode === "stopwatch"
              ? "bg-[#FFE3A6] text-black"
              : theme === "dark"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleModeChange("stopwatch")}
          whileHover={{ y: -2 }}
          whileTap={{ y: 1 }}
          transition={{ duration: 0 }}
        >
          Timer
        </motion.button>
      </motion.div>

      {/* Timer display with animation */}
      <motion.div
        key={`${mode}-${isBreak}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`text-6xl md:text-6xl lg:text-8xl font-bold mb-6 md:mb-8 transition-colors duration-300 ${
          isBreak
            ? "text-gray-500"
            : theme === "dark"
            ? "text-white"
            : "text-black"
        }`}
      >
        {formatTime(time)}
      </motion.div>

      {/* Control buttons with improved styling */}
      <div className="flex justify-center items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
        <AnimatePresence mode="wait">
          {showStart ? (
            <motion.div
              key="start-controls"
              className="flex space-x-5 md:space-x-6"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0 }}
            >
              <motion.button
                key="resume"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                transition={{ duration: 0 }}
                onClick={startTimer}
                className="timer-control-button timer-start-button flex items-center justify-center gap-2 w-[130px] md:w-[150px]"
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
              >
                <Timer size={20} />
                <span className="text-base md:text-lg font-medium">
                  {time > 0 && (isRunning === false && time !== (mode === 'pomodoro' ? pomodoroTime : (mode === 'countdown' ? countdownTime : 0))) 
                    ? "Resume" 
                    : "Start"}
                </span>
              </motion.button>
              
              {/* Show Reset button when timer is paused (not at initial state) */}
              {time > 0 && time !== (mode === 'pomodoro' ? pomodoroTime : (mode === 'countdown' ? countdownTime : 0)) && (
                <motion.button
                  key="reset"
                  onClick={resetTimer}
                  className="timer-control-button timer-reset-button flex items-center justify-center gap-2 w-[120px] md:w-[140px]"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 1 }}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 1 }}
                  transition={{ duration: 0 }}
                >
                  <RefreshCcw size={20} />
                  <span className="text-base md:text-lg font-medium">Reset</span>
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="controls"
              className="flex space-x-5 md:space-x-6"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0 }}
            >
              <motion.button
                onClick={pauseTimer}
                className="timer-control-button timer-start-button flex items-center justify-center gap-2 w-[120px] md:w-[140px]"
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                transition={{ duration: 0 }}
              >
                <Pause size={20} />
                <span className="text-base md:text-lg font-medium">Pause</span>
              </motion.button>
              <motion.button
                onClick={resetTimer}
                className="timer-control-button timer-start-button flex items-center justify-center gap-2 w-[120px] md:w-[140px]"
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                transition={{ duration: 0 }}
              >
                <RefreshCcw size={20} />
                <span className="text-base md:text-lg font-medium">Reset</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      
        <motion.button
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSettingsOpen(true)}
          className="timer-control-button timer-settings-button flex items-center justify-center ml-2" // Added margin-left
        >
          <Settings size={20} />
        </motion.button>
      </div>

      {/* Coins display with animation */}
      <motion.div
        className="mt-3 md:mt-4 text-base md:text-lg font-semibold flex items-center justify-center gap-2 transition-colors duration-300"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Coins size={20} className="text-yellow-500" />
        <motion.span
          key={coins}
          initial={{ scale: 1.5, color: "#FFD700" }}
          animate={{
            scale: 1,
            color: theme === "dark" ? "#FFFFFF" : "#000000",
          }}
          transition={{ duration: 0.5 }}
        >
          {coins} Coins Earned
        </motion.span>
      </motion.div>

      {/* Settings dialog with improved styling */}
      <AnimatePresence>
        {isSettingsOpen && (
          <Dialog
            open={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <motion.div
              className="fixed inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className={`p-6 md:p-8 rounded-2xl shadow-2xl w-80 md:w-96 relative transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-black"
              }`}
            >
              <motion.button
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </motion.button>
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Timer Settings</h2>

              {/* Settings inputs with improved styling */}
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block mb-1 md:mb-2 font-medium">
                    Pomodoro Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={pomodoroTime / 60}
                    min={0}
                    max={59}
                    onChange={(e) =>{ 
                      const value = Math.max(0, Math.min(59, Number(e.target.value)));
                      setPomodoroTime(value * 60);
                    }}
                    className="w-full p-2 md:p-3 border border-gray-300 rounded-lg transition-colors duration-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 md:mb-2 font-medium">
                    Break Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={breakTime / 60}
                    min={0}
                    max={59}
                    onChange={(e) => { 
                      const value = Math.max(0, Math.min(59, Number(e.target.value)));
                      setBreakTime(value * 60);
                    }}
                    className="w-full p-2 md:p-3 border border-gray-300 rounded-lg transition-colors duration-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 md:mb-2 font-medium">
                    Countdown Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={countdownTime / 60}
                    min={0}
                    max={59}
                    onChange={(e) => { 
                      const value = Math.max(0, Math.min(59, Number(e.target.value)));
                      setCountdownTime(value * 60);
                    }}
                    className="w-full p-2 md:p-3 border border-gray-300 rounded-lg transition-colors duration-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 md:mb-2 font-medium">
                    Number of Cycles
                  </label>
                  <input
                    type="number"
                    value={cycles}
                    min={0}
                    max={10}
                    onChange={(e) => { 
                      const value = Math.max(0, Math.min(10, Number(e.target.value)));
                      setCycles(value);
                    }}
                    className="w-full p-2 md:p-3 border border-gray-300 rounded-lg transition-colors duration-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveSettings}
                className="bg-[#7500CA] text-white w-full py-2 md:py-3 rounded-lg mt-4 md:mt-6 font-medium text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Save Settings
              </motion.button>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  );
}