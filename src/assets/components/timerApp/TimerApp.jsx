import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Timer, Pause, RefreshCcw, Settings, X, Coins } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { useTheme } from "../../context/ThemeContext.jsx";
import "./TimerApp.css";
import { motion, AnimatePresence } from "framer-motion";
import { useSelectedTask } from "../../context/SelectedTaskContext.jsx";

export default function TimerApp({ setParentPopupState }) {
  // Add timestamp tracking for accurate timing across tab switches and page reloads
  const [timerStartedAt, setTimerStartedAt] = useState(() => {
    return localStorage.getItem("timerStartedAt")
      ? parseInt(localStorage.getItem("timerStartedAt"))
      : null;
  });

  const [mode, setMode] = useState(
    () => localStorage.getItem("timerMode") || "pomodoro"
  );
  const [time, setTime] = useState(() => {
    const savedTime = localStorage.getItem("timerTime");
    return savedTime ? parseInt(savedTime) : 25 * 60;
  });
  const [isRunning, setIsRunning] = useState(() => {
    return localStorage.getItem("timerIsRunning") === "true";
  });
  const [showStart, setShowStart] = useState(() => {
    return localStorage.getItem("timerShowStart") !== "false";
  });
  const [pomodoroTime, setPomodoroTime] = useState(() => {
    const saved = localStorage.getItem("timerPomodoroTime");
    return saved ? parseInt(saved) : 25 * 60;
  });
  const [breakTime, setBreakTime] = useState(() => {
    const saved = localStorage.getItem("timerBreakTime");
    return saved ? parseInt(saved) : 5 * 60;
  });
  const [cycles, setCycles] = useState(() => {
    const saved = localStorage.getItem("timerCycles");
    return saved ? parseInt(saved) : 1;
  });
  const [currentCycle, setCurrentCycle] = useState(() => {
    const saved = localStorage.getItem("timerCurrentCycle");
    return saved ? parseInt(saved) : 0;
  });
  const [isBreak, setIsBreak] = useState(() => {
    return localStorage.getItem("timerIsBreak") === "true";
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [countdownTime, setCountdownTime] = useState(() => {
    const saved = localStorage.getItem("timerCountdownTime");
    return saved ? parseInt(saved) : 5 * 60;
  });
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem("timerCoins");
    return saved ? parseFloat(saved) : 0;
  });
  // Track the initial time when timer starts to calculate elapsed minutes correctly
  const [initialTime, setInitialTime] = useState(null);
  // Track minutes elapsed to avoid awarding coins multiple times
  const [minutesElapsed, setMinutesElapsed] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState(() => {
    return localStorage.getItem("timerPauseStartTime")
      ? parseInt(localStorage.getItem("timerPauseStartTime"))
      : null;
  });
  const [totalPausedTime, setTotalPausedTime] = useState(() => {
    const saved = localStorage.getItem("timerTotalPausedTime");
    return saved ? parseInt(saved) : 0;
  });
  const [lastSavedTimeOnReset, setLastSavedTimeOnReset] = useState(0); // To track time for reset
  const { selectedTaskId } = useSelectedTask();

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
      if (
        typeof timeSpentInSecondsValue !== "number" ||
        timeSpentInSecondsValue <= 0
      ) {
        console.warn(
          "Invalid or zero timeSpentInSecondsValue, not saving:",
          timeSpentInSecondsValue
        );
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
    localStorage.setItem("timerMode", mode);
    localStorage.setItem("timerTime", time.toString());
    localStorage.setItem("timerIsRunning", isRunning.toString());
    localStorage.setItem("timerShowStart", showStart.toString());
    localStorage.setItem("timerPomodoroTime", pomodoroTime.toString());
    localStorage.setItem("timerBreakTime", breakTime.toString());
    localStorage.setItem("timerCycles", cycles.toString());
    localStorage.setItem("timerCurrentCycle", currentCycle.toString());
    localStorage.setItem("timerIsBreak", isBreak.toString());
    localStorage.setItem("timerCountdownTime", countdownTime.toString());
    localStorage.setItem("timerCoins", coins.toString());
    localStorage.setItem("timerTotalPausedTime", totalPausedTime.toString());

    if (timerStartedAt) {
      localStorage.setItem("timerStartedAt", timerStartedAt.toString());
    } else {
      localStorage.removeItem("timerStartedAt");
    }
    if (pauseStartTime) {
      localStorage.setItem("timerPauseStartTime", pauseStartTime.toString());
    } else {
      localStorage.removeItem("timerPauseStartTime");
    }
  }, [
    mode,
    time,
    isRunning,
    showStart,
    pomodoroTime,
    breakTime,
    cycles,
    currentCycle,
    isBreak,
    countdownTime,
    coins,
    timerStartedAt,
    totalPausedTime,
    pauseStartTime, // Added new state variables to dependency array
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
        setTime((prevTime) => prevTime + elapsedSecondsWhileAway);
      } else {
        // For countdown and pomodoro
        const currentTimeSnapshot = time;
        const remainingTimeAfterAway =
          currentTimeSnapshot - elapsedSecondsWhileAway;

        if (remainingTimeAfterAway <= 0) {
          // Timer completed while away
          setTime(0);
          setIsRunning(false);
          setShowStart(true);
          notificationSound
            .play()
            .catch((e) => console.log("Error playing sound:", e));

          if (mode === "pomodoro") {
            if (!isBreak) {
              console.log(
                `Pomodoro session finished while away. Elapsed: ${elapsedSecondsWhileAway}s, Original Pomodoro Time: ${pomodoroTime}s`
              );
              onPomodoroEnd();
              saveTimeSpentToDatabase(pomodoroTime);
              setLastSavedTimeOnReset(0); // Reset accumulated time after full session is saved

              // Standardized coin award: 0.5 coins for every full minute completed in a Pomodoro session.
              const minutesInSession = Math.floor(pomodoroTime / 60);
              if (minutesInSession > 0) {
                const coinsForSession = minutesInSession * 1;
                console.log(
                  `PageLoad: Pomodoro completed away. Awarding ${coinsForSession} coins.`
                );
                saveCoinsToDatabase(coinsForSession);
                // setCoins will be initialized from localStorage, which should reflect this save after 'coinUpdate'
              }

              if (currentCycle + 1 < cycles) {
                setCurrentCycle((prev) => prev + 1);
                setIsBreak(true);
                setTime(breakTime);
                setTimerStartedAt(null); // Clear for the completed pomodoro session
                localStorage.removeItem("timerStartedAt");
              } else {
                console.log(
                  "All Pomodoro cycles completed while away (page load)."
                );
                setParentPopupState(true);
                // Reload on last cycle completion is primarily handled by visibility change.
                // If page loads and finds it *already* completed, resetTimer is appropriate.
                resetTimer();
              }
            } else {
              // Break finished while away
              console.log("Break finished while away.");
              setIsBreak(false);
              // setCurrentCycle will be advanced by resetTimer or next pomodoro start
              if (currentCycle + 1 < cycles) {
                setCurrentCycle((prev) => prev + 1);
                setTime(pomodoroTime);
                // isRunning from localStorage will determine if it auto-starts.
                // timerStartedAt will be set by main timer if it auto-starts.
              } else {
                console.log(
                  "All cycles and final break completed while away (page load)."
                );
                setParentPopupState(true);
                resetTimer();
              }
            }
          }
          // Ensure timerStartedAt is cleared if the session ended
          if (!isRunning) {
            // Check current isRunning state after updates
            localStorage.removeItem("timerStartedAt");
            setTimerStartedAt(null);
          }
        } else {
          // Timer did NOT complete while away, just update the time
          setTime(remainingTimeAfterAway);
          if (mode === "pomodoro" && !isBreak && elapsedSecondsWhileAway > 0) {
            saveTimeSpentToDatabase(elapsedSecondsWhileAway); // Save partial time

            // Award coins for minutes elapsed while away, respecting minutesElapsed state
            const currentMinutesAlreadyAwarded = minutesElapsed; // From localStorage via state
            // initialTime should be the start of this specific pomodoro session
            const totalMinutesNowEffectivelyElapsed = initialTime
              ? Math.floor((initialTime - remainingTimeAfterAway) / 60)
              : 0;

            if (
              totalMinutesNowEffectivelyElapsed > currentMinutesAlreadyAwarded
            ) {
              const newMinutesToAwardFor =
                totalMinutesNowEffectivelyElapsed -
                currentMinutesAlreadyAwarded;
              const newCoins = newMinutesToAwardFor * 1; // Standardized 0.5 coins
              if (newCoins > 0) {
                console.log(
                  `PageLoad: Partial pomodoro. Awarding ${newCoins} coins for ${newMinutesToAwardFor} new minutes.`
                );
                saveCoinsToDatabase(newCoins);
                setCoins((prev) => prev + newCoins); // Update local state
                setMinutesElapsed(totalMinutesNowEffectivelyElapsed);
              }
            }
          }
        }
      }
    } else if (!isRunning && localStorage.getItem("timerStartedAt")) {
      // Clean up orphaned timerStartedAt if timer is not running
      console.log("Cleaning up orphaned timerStartedAt from localStorage.");
      localStorage.removeItem("timerStartedAt");
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

        setTime((prevTime) => {
          // For stopwatch, add elapsed time
          if (mode === "stopwatch") {
            setLastSavedTimeOnReset((prev) => prev + secondsToUpdate); // Track time for reset
            return prevTime + secondsToUpdate;
          }

          // For countdown and pomodoro, subtract elapsed time
          const newTime = Math.max(0, prevTime - secondsToUpdate);

          if (mode === "pomodoro" && !isBreak && prevTime > newTime) {
            // Increment time for reset only when pomodoro is active and time is decreasing
            setLastSavedTimeOnReset((prev) => prev + (prevTime - newTime));
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
                if (initialTime && initialTime - newTime >= 60) {
                  // newTime is 0 here
                  console.log(
                    "Awarding 0.5 coins for pomodoro cycle completion (visible)"
                  );
                  saveCoinsToDatabase(1);
                  setCoins((prevCoins) => prevCoins + 1);
                  saveTimeSpentToDatabase(pomodoroTime);
                  setLastSavedTimeOnReset(0); // Reset after saving full pomodoro
                }
                return breakTime;
              } else {
                // This is the final cycle
                setIsRunning(false);
                setShowStart(true);
                // Only award coins if the timer ran for at least 1 minute
                if (initialTime && initialTime - newTime >= 60) {
                  // newTime is 0 here
                  console.log(
                    "Awarding 0.5 coins for final pomodoro cycle completion (visible)"
                  );
                  saveCoinsToDatabase(0.5);
                  setCoins((prevCoins) => prevCoins + 1);
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
          if (
            mode === "pomodoro" &&
            !isBreak &&
            initialTime &&
            isRunning &&
            prevTime > newTime
          ) {
            // Ensure timer is active and time decreased
            // Calculate total minutes elapsed since this specific pomodoro session started
            const totalMinutesElapsedThisSession = Math.floor(
              (initialTime - newTime) / 60
            );

            if (
              totalMinutesElapsedThisSession > minutesElapsed &&
              totalMinutesElapsedThisSession > 0
            ) {
              const newlyCompletedMinutes =
                totalMinutesElapsedThisSession - minutesElapsed;
              const newCoins = newlyCompletedMinutes * 1; // Standardized 0.5 coins per new minute
              if (newCoins > 0) {
                console.log(
                  `MainTimer: Awarding ${newCoins} coins for minute(s) up to ${totalMinutesElapsedThisSession} (visible)`
                );
                saveCoinsToDatabase(newCoins);
                setCoins((prev) => prev + newCoins);
              }
              setMinutesElapsed(totalMinutesElapsedThisSession);
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
  }, [
    isRunning,
    mode,
    isBreak,
    cycles,
    currentCycle,
    pomodoroTime,
    breakTime,
    timerStartedAt,
    initialTime,
    minutesElapsed,
  ]);

  // Enhanced visibility change handler to work with requestAnimationFrame
  useEffect(() => {
    let visibilityChangeTime = null;
    let visibilityChangeTimeout = null;

    const handleVisibilityChange = () => {
      if (visibilityChangeTimeout) {
        clearTimeout(visibilityChangeTimeout);
      }

      visibilityChangeTimeout = setTimeout(() => {
        const now = Date.now();

        if (document.visibilityState === "hidden") {
          visibilityChangeTime = now;
        } else if (document.visibilityState === "visible" && isRunning) {
          // `isRunning` is the state before this handler's effects
          if (visibilityChangeTime) {
            const hiddenDuration = now - visibilityChangeTime;
            let timerShouldContinueRunning = isRunning;

            if (hiddenDuration > 1000) {
              if (mode === "stopwatch") {
                const elapsedSeconds = Math.floor(hiddenDuration / 1000);
                setTime((prevTime) => prevTime + elapsedSeconds);
              } else {
                // For countdown and pomodoro
                const elapsedSeconds = Math.floor(hiddenDuration / 1000);
                let pomodoroCompletedAllCyclesInThisUpdate = false;
                let timerJustCompletedInThisUpdate = false;
                let shouldReloadPage = false; // Flag for page reload

                const cycleBeforeUpdate = currentCycle; // Capture currentCycle before setTime potentially changes it

                setTime((prevTime) => {
                  const newTime = Math.max(0, prevTime - elapsedSeconds);

                  if (newTime === 0 && prevTime > 0) {
                    // Timer completed
                    timerJustCompletedInThisUpdate = true;
                    notificationSound
                      .play()
                      .catch((e) => console.log("Error playing sound:", e));
                    onPomodoroEnd();
                    if (mode === "pomodoro" && !isBreak) {
                      // Use initialTime (which should be pomodoroTime for this session) or fallback to pomodoroTime
                      const sessionDurationForCoins =
                        initialTime || pomodoroTime;
                      const minutesInSession = Math.floor(
                        sessionDurationForCoins / 60
                      );

                      if (minutesInSession > 0) {
                        // Award coins based on minutes already passed in this session, up to total.
                        // This ensures we only award for newly completed minutes if some were already awarded.
                        const newlyCompletedMinutes =
                          minutesInSession - minutesElapsed;
                        if (newlyCompletedMinutes > 0) {
                          const coinsForCompletion =
                            newlyCompletedMinutes * 0.5;
                          console.log(
                            `VisibilityChange: Pomodoro completed. Awarding ${coinsForCompletion} coins for ${newlyCompletedMinutes} new minutes.`
                          );
                          saveCoinsToDatabase(coinsForCompletion);
                          // setCoins(prev => prev + coinsForCompletion); // Coins will be re-read on reload or from localStorage
                        }
                      }
                      saveTimeSpentToDatabase(pomodoroTime); // Save full pomodoro duration
                      setLastSavedTimeOnReset(0); // Reset accumulated time after full session is saved

                      if (cycleBeforeUpdate < cycles - 1) {
                        setIsBreak(true);
                        // minutesElapsed will be reset when next pomodoro starts
                        return breakTime;
                      } else {
                        // All pomodoro cycles completed
                        pomodoroCompletedAllCyclesInThisUpdate = true;
                        shouldReloadPage = true; // Set flag to reload

                        setIsRunning(false);
                        timerShouldContinueRunning = false;
                        setShowStart(true);
                        setIsBreak(false);
                        // setCurrentCycle(0); // Will be reset by reload or resetTimer
                        setTimerStartedAt(null);
                        return 0;
                      }
                    } else if (mode === "pomodoro" && isBreak) {
                      setIsBreak(false);
                      setCurrentCycle((prev) => prev + 1);
                      return pomodoroTime;
                    } else {
                      // Countdown completed
                      setIsRunning(false);
                      timerShouldContinueRunning = false;
                      setShowStart(true);
                      setTimerStartedAt(null);
                      return 0;
                    }
                  }
                  return newTime; // Timer did NOT complete, just update the time
                });

                if (mode === "pomodoro" && !isBreak) {
                  setInitialTime(time);
                }

                if (pomodoroCompletedAllCyclesInThisUpdate) {
                  setParentPopupState(true);
                }

                if (shouldReloadPage) {
                  console.log(
                    "Last Pomodoro cycle completed while hidden. Reloading page."
                  );
                  window.location.reload();
                  return; // Stop further processing in this handler after reload call
                }

                // Update minutes elapsed for coin calculation ONLY IF TIMER DID NOT COMPLETE IN THIS UPDATE
                if (
                  !timerJustCompletedInThisUpdate &&
                  mode === "pomodoro" &&
                  !isBreak &&
                  initialTime &&
                  isRunning
                ) {
                  const effectivePrevTime = time;
                  const totalMinutesNowEffectivelyElapsed = Math.floor(
                    (initialTime - (time - elapsedSeconds)) / 60
                  );
                  const newCurrentTime = Math.max(0, time - elapsedSeconds);
                  const totalMinutesNowActuallyElapsed = Math.floor(
                    (initialTime - newCurrentTime) / 60
                  );

                  if (totalMinutesNowActuallyElapsed > minutesElapsed) {
                    const minutesNewlyPassedWhileHidden =
                      totalMinutesNowActuallyElapsed - minutesElapsed;
                    const newCoinsToAdd = minutesNewlyPassedWhileHidden * 1; // Changed from 0.5 to 1 for hidden scenario
                    if (newCoinsToAdd > 0) {
                      console.log(
                        `VisibilityChange: Partial pomodoro (hidden). Awarding ${newCoinsToAdd} coins for ${minutesNewlyPassedWhileHidden} new minutes.`
                      );
                      saveCoinsToDatabase(newCoinsToAdd);
                      setCoins((prev) => prev + newCoinsToAdd);
                    }
                    setMinutesElapsed(totalMinutesNowActuallyElapsed);
                  }
                }
              }

              if (timerShouldContinueRunning) {
                setTimerStartedAt(now); // Update timestamp to now as we've accounted for hidden time
              } else {
                setTimerStartedAt(null); // Ensure it's cleared if timer stopped
                localStorage.removeItem("timerStartedAt");
              }
            }
          }
          visibilityChangeTime = null;
        }
      }, 100);
    };

    // Use both visibilitychange and focus/blur events for better cross-browser support
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);
    window.addEventListener("blur", () => {
      visibilityChangeTime = Date.now();
    });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
      window.removeEventListener("blur", () => {});
      clearTimeout(visibilityChangeTimeout);
    };
  }, [
    isRunning,
    mode,
    isBreak,
    time,
    initialTime,
    pomodoroTime,
    breakTime,
    cycles,
    currentCycle,
    minutesElapsed,
  ]);

  const startTimer = () => {
    setIsRunning(true);
    setShowStart(false);

    if (pauseStartTime) {
      const currentPauseDuration = Date.now() - pauseStartTime;
      setTotalPausedTime((prev) => prev + currentPauseDuration);
      setPauseStartTime(null);
    }

    // Start timer with 1 second less to avoid immediate coin award
    if (mode === "pomodoro" && !isBreak && time === pomodoroTime) {
      setTime((prevTime) => Math.max(0, prevTime - 1));
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
      saveTimeSpentToDatabase(lastSavedTimeOnReset / 2); // Corrected: save seconds directly
      console.log(`Saved ${lastSavedTimeOnReset} seconds for reset.`);
      // Initialize to 0 immediately after saving to database
      setLastSavedTimeOnReset(0); // Reset after saving
    } else {
      // Ensure it's set to 0 even if there was no time to save
      setLastSavedTimeOnReset(0);
    }

    // Remove the duplicate setLastSavedTimeOnReset(0) call that was here
    console.log(`After resetting ${lastSavedTimeOnReset}`);

    setShowStart(true);
    setIsBreak(false);
    setCurrentCycle(0);
    setInitialTime(null);
    setMinutesElapsed(0);
    setPauseStartTime(null); // Reset pause start time
    setTotalPausedTime(0); // Reset total paused time

    // Ensure pomodoroTime, countdownTime have valid defaults if not loaded from settings
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

  const onPomodoroEnd = async () => {
    if (!selectedTaskId) return;

    try {
      await axios.post(
        "/api/tasks/complete-pomodoro",
        { taskId: selectedTaskId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Pomodoro marked complete.");
    } catch (error) {
      console.error("Failed to complete pomodoro:", error);
    }
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
        padding: "32px 24px",
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
                  {time > 0 &&
                  isRunning === false &&
                  time !==
                    (mode === "pomodoro"
                      ? pomodoroTime
                      : mode === "countdown"
                      ? countdownTime
                      : 0)
                    ? "Resume"
                    : "Start"}
                </span>
              </motion.button>

              {/* Show Reset button when timer is paused (not at initial state) */}
              {time > 0 &&
                time !==
                  (mode === "pomodoro"
                    ? pomodoroTime
                    : mode === "countdown"
                    ? countdownTime
                    : 0) && (
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
                    <span className="text-base md:text-lg font-medium">
                      Reset
                    </span>
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
                backgroundColor: "rgba(0, 0, 0, 0.45)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
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
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
                Timer Settings
              </h2>

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
                    max={9999}
                    onChange={(e) => {
                      const value = Math.max(
                        0,
                        Math.min(9999, Number(e.target.value))
                      );
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
                    max={9999}
                    onChange={(e) => {
                      const value = Math.max(
                        0,
                        Math.min(9999, Number(e.target.value))
                      );
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
                    max={9999}
                    onChange={(e) => {
                      const value = Math.max(
                        0,
                        Math.min(9999, Number(e.target.value))
                      );
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
                    max={100}
                    onChange={(e) => {
                      const value = Math.max(
                        0,
                        Math.min(100, Number(e.target.value))
                      );
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
