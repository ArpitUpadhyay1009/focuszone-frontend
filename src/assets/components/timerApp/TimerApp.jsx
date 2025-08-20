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
  const [coins, setCoins] = useState(0);
  // Track the initial time when timer starts to calculate elapsed minutes correctly
  const [initialTime, setInitialTime] = useState(null);
  // Track minutes elapsed to avoid awarding coins multiple times (use ref for timer logic)
  const minutesElapsedRef = useRef(0);
  const [pauseStartTime, setPauseStartTime] = useState(() => {
    return localStorage.getItem("timerPauseStartTime")
      ? parseInt(localStorage.getItem("timerPauseStartTime"))
      : null;
  });
  const [totalPausedTime, setTotalPausedTime] = useState(() => {
    const saved = localStorage.getItem("timerTotalPausedTime");
    return saved ? parseInt(saved) : 0;
  });
  const { selectedTaskId } = useSelectedTask();

  const notificationSound = new Audio("/notification.mp3");

  const { theme } = useTheme();

  // Store backend total time in seconds
  const backendTotalTimeRef = useRef(0);
  // Store unsaved session seconds in a ref
  const unsavedSessionSecondsRef = useRef(0);
  // Refs for mode and isBreak to avoid closure issues in timer loop
  const modeRef = useRef(mode);
  const isBreakRef = useRef(isBreak);
  // Ref to store animation frame ID and guarantee only one loop
  const animationFrameIdRef = useRef(null);
  // Guard to prevent double-mounting in React Strict Mode
  const mountedRef = useRef(false);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    isBreakRef.current = isBreak;
  }, [isBreak]);

  // Fetch backend total time on mount
  useEffect(() => {
    const fetchBackendTotalTime = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await axios.get(
          "/api/user-activity/total-time-spent",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data && response.data.totalTimeSpent !== undefined) {
          backendTotalTimeRef.current = response.data.totalTimeSpent;
        }
      } catch (error) {
        // fallback: do nothing
      }
    };
    fetchBackendTotalTime();
  }, []);

  // Function to save time spent to the database
  const saveTimeSpentToDatabase = async (timeSpentInSecondsValue) => {
    try {
      // Hack: divide by 1.9 to compensate for double-counting in dev
      const adjustedTime = Math.round(timeSpentInSecondsValue / 1.9);
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

      const response = await axios.post(
        "/api/user-activity/update-time-spent",
        { timeSpentInSeconds: adjustedTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update backend total
      backendTotalTimeRef.current += adjustedTime;
      unsavedSessionSecondsRef.current = 0;
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
            .catch((e) => console.error("Error playing sound:", e));

          if (mode === "pomodoro") {
            if (!isBreak) {
              onPomodoroEnd();
              // Save focus time with division hack
              saveTimeSpentToDatabase(unsavedSessionSecondsRef.current);
              unsavedSessionSecondsRef.current = 0;
              // Award only remaining unawarded minutes at 1 coin/min
              const minutesInSession = Math.floor(pomodoroTime / 60);
              const remainingMinutes = Math.max(
                0,
                minutesInSession - minutesElapsedRef.current
              );
              if (remainingMinutes > 0) {
                const coinsForCompletion = remainingMinutes * 1;
                saveCoinsToDatabase(coinsForCompletion);
                setCoins((prev) => prev + coinsForCompletion);
                minutesElapsedRef.current = minutesInSession;
              }

              if (currentCycle + 1 < cycles) {
                setCurrentCycle((prev) => prev + 1);
                setIsBreak(true);
                setTime(breakTime);
                // Auto-start break immediately when pomodoro completes while away
                setIsRunning(true);
                setShowStart(false);
                setTimerStartedAt(Date.now());
                setInitialTime(breakTime);
                minutesElapsedRef.current = 0;
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
                // Auto-start next pomodoro immediately when break completes while away
                setIsRunning(true);
                setShowStart(false);
                setTimerStartedAt(Date.now());
                setInitialTime(pomodoroTime);
                minutesElapsedRef.current = 0;
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
            const currentMinutesAlreadyAwarded = minutesElapsedRef.current; // From localStorage via state
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
                saveCoinsToDatabase(newCoins);
                setCoins((prev) => prev + newCoins); // Update local state
                minutesElapsedRef.current = totalMinutesNowEffectivelyElapsed;
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
  // Move updateTimer outside the effect so it can be called from anywhere
  let lastUpdateTime = null;
  function updateTimer() {
    const now = Date.now();
    if (!lastUpdateTime) {
      lastUpdateTime = now;
    }
    const deltaTime = now - lastUpdateTime;
    if (deltaTime >= 1000) {
      const secondsToUpdate = Math.floor(deltaTime / 1000);
      lastUpdateTime = now - (deltaTime % 1000);
      setTime((prevTime) => {
        if (modeRef.current === "stopwatch") {
          unsavedSessionSecondsRef.current += secondsToUpdate;
          window.dispatchEvent(
            new CustomEvent("focusTimeTick", {
              detail: {
                totalSeconds:
                  backendTotalTimeRef.current +
                  unsavedSessionSecondsRef.current,
              },
            })
          );
          return prevTime + secondsToUpdate;
        }
        const newTime = Math.max(0, prevTime - secondsToUpdate);
        if (
          ((modeRef.current === "pomodoro" && !isBreakRef.current) ||
            modeRef.current === "countdown") &&
          prevTime > newTime
        ) {
          unsavedSessionSecondsRef.current += prevTime - newTime;
          // Per-minute coin logic (same as visibility handler)
          if (initialTime) {
            const totalMinutesElapsedThisSession = Math.floor(
              (initialTime - newTime) / 60
            );
            if (
              totalMinutesElapsedThisSession > minutesElapsedRef.current &&
              totalMinutesElapsedThisSession > 0
            ) {
              const newlyCompletedMinutes =
                totalMinutesElapsedThisSession - minutesElapsedRef.current;
              const newCoins = newlyCompletedMinutes * 1;
              if (newCoins > 0) {
                saveCoinsToDatabase(newCoins);
                setCoins((prev) => prev + newCoins);
              }
              minutesElapsedRef.current = totalMinutesElapsedThisSession;
            }
          }
        }
        window.dispatchEvent(
          new CustomEvent("focusTimeTick", {
            detail: {
              totalSeconds:
                backendTotalTimeRef.current + unsavedSessionSecondsRef.current,
            },
          })
        );
        return newTime;
      });
    }
    if (isRunning) {
      animationFrameIdRef.current = requestAnimationFrame(updateTimer);
    }
  }

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    // Always cancel any previous animation frame before starting a new one
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (isRunning) {
      if (!timerStartedAt) {
        setTimerStartedAt(Date.now());
      }
      lastUpdateTime = Date.now();
      animationFrameIdRef.current = requestAnimationFrame(updateTimer);
    }
    return () => {
      mountedRef.current = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [isRunning, timerStartedAt]);

  // Enhanced visibility change handler to work with requestAnimationFrame
  useEffect(() => {
    let visibilityChangeTime = null;
    let visibilityChangeTimeout = null;

    const handleVisibilityChange = () => {
      // Quick recovery: Clear any corrupted state when page becomes visible
      if (document.visibilityState === "visible") {
        // Force a clean state recovery
        const savedIsRunning =
          localStorage.getItem("timerIsRunning") === "true";
        const savedTime = localStorage.getItem("timerTime");
        const savedMode = localStorage.getItem("timerMode");

        // If state seems corrupted, reset to safe defaults
        if (savedIsRunning && (!savedTime || !savedMode)) {
          console.log("Detected corrupted timer state, resetting...");
          localStorage.removeItem("timerStartedAt");
          localStorage.removeItem("timerPauseStartTime");
          localStorage.setItem("timerIsRunning", "false");
          localStorage.setItem("timerShowStart", "true");
          window.location.reload();
          return;
        }
      }
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
                    // Timer completed while hidden
                    timerJustCompletedInThisUpdate = true;
                    notificationSound
                      .play()
                      .catch((e) => console.log("Error playing sound:", e));
                    onPomodoroEnd();

                    if (mode === "pomodoro" && !isBreak) {
                      // Pomodoro session completed
                      const sessionDurationForCoins =
                        initialTime || pomodoroTime;
                      const minutesInSession = Math.floor(
                        sessionDurationForCoins / 60
                      );

                      if (minutesInSession > 0) {
                        const newlyCompletedMinutes =
                          minutesInSession - minutesElapsedRef.current;
                        if (newlyCompletedMinutes > 0) {
                          const coinsForCompletion = newlyCompletedMinutes * 1;
                          saveCoinsToDatabase(coinsForCompletion);
                        }
                      }

                      // Save focus time with division hack
                      saveTimeSpentToDatabase(unsavedSessionSecondsRef.current);
                      unsavedSessionSecondsRef.current = 0;

                      if (cycleBeforeUpdate < cycles - 1) {
                        // Start break automatically (synchronously update state and refs)
                        setCurrentCycle((prev) => prev + 1);
                        setIsBreak(true);
                        setIsRunning(true);
                        setShowStart(false);
                        setTimerStartedAt(now);
                        setInitialTime(breakTime);
                        setTime(breakTime);
                        isBreakRef.current = true;
                        modeRef.current = mode;
                        minutesElapsedRef.current = 0;
                        animationFrameIdRef.current =
                          requestAnimationFrame(updateTimer);
                        return breakTime;
                      } else if (cycleBeforeUpdate + 1 === cycles) {
                        // Last Pomodoro, do a final break
                        setCurrentCycle((prev) => prev + 1);
                        setIsBreak(true);
                        setIsRunning(true);
                        setShowStart(false);
                        setTimerStartedAt(now);
                        setInitialTime(breakTime);
                        setTime(breakTime);
                        isBreakRef.current = true;
                        modeRef.current = mode;
                        minutesElapsedRef.current = 0;
                        animationFrameIdRef.current =
                          requestAnimationFrame(updateTimer);
                        return breakTime;
                      } else {
                        // All pomodoro cycles completed
                        pomodoroCompletedAllCyclesInThisUpdate = true;
                        shouldReloadPage = true;
                        setIsRunning(false);
                        timerShouldContinueRunning = false;
                        setShowStart(true);
                        setIsBreak(false);
                        setTimerStartedAt(null);
                        isBreakRef.current = false;
                        modeRef.current = mode;
                        return 0;
                      }
                    } else if (mode === "pomodoro" && isBreak) {
                      // Break completed while hidden (synchronously update state and refs)
                      setIsBreak(false);
                      setIsRunning(true);
                      setShowStart(false);
                      setTimerStartedAt(now);
                      setInitialTime(pomodoroTime);
                      setTime(pomodoroTime);
                      isBreakRef.current = false;
                      modeRef.current = mode;
                      minutesElapsedRef.current = 0;
                      animationFrameIdRef.current =
                        requestAnimationFrame(updateTimer);
                      if (cycleBeforeUpdate < cycles - 1) {
                        return pomodoroTime;
                      } else {
                        // All cycles and breaks completed
                        setIsRunning(false);
                        timerShouldContinueRunning = false;
                        setShowStart(true);
                        setCurrentCycle(0);
                        setTimerStartedAt(null);
                        isBreakRef.current = false;
                        modeRef.current = mode;
                        return pomodoroTime; // Reset to initial pomodoro time
                      }
                    } else {
                      // Countdown completed
                      // Award only remaining unawarded minutes at 1 coin/min
                      const minutesInSession = initialTime
                        ? Math.floor(initialTime / 60)
                        : Math.floor((countdownTime || 0) / 60);
                      if (minutesInSession > 0) {
                        const remainingMinutes = Math.max(
                          0,
                          minutesInSession - minutesElapsedRef.current
                        );
                        if (remainingMinutes > 0) {
                          const coinsForCompletion = remainingMinutes * 1;
                          saveCoinsToDatabase(coinsForCompletion);
                          setCoins((prev) => prev + coinsForCompletion);
                          minutesElapsedRef.current = minutesInSession;
                        }
                      }
                      setIsRunning(false);
                      timerShouldContinueRunning = false;
                      setShowStart(true);
                      setTimerStartedAt(null);
                      setInitialTime(null);
                      // Auto-reset display back to initial countdown time
                      setTime(countdownTime);
                      return countdownTime;
                    }
                  }
                  return newTime; // Timer did NOT complete, just update the time
                });

                if (pomodoroCompletedAllCyclesInThisUpdate) {
                  setParentPopupState(true);
                }

                if (shouldReloadPage) {
                  console.log(
                    "Last Pomodoro cycle completed while hidden. Reloading page."
                  );
                  window.location.reload();
                  return;
                }

                // Update minutes elapsed for coin calculation ONLY IF TIMER DID NOT COMPLETE IN THIS UPDATE
                if (
                  !timerJustCompletedInThisUpdate &&
                  ((mode === "pomodoro" && !isBreak) || mode === "countdown") &&
                  initialTime &&
                  isRunning
                ) {
                  const totalMinutesNowEffectivelyElapsed = Math.floor(
                    (initialTime - (time - elapsedSeconds)) / 60
                  );
                  const newCurrentTime = Math.max(0, time - elapsedSeconds);
                  const totalMinutesNowActuallyElapsed = Math.floor(
                    (initialTime - newCurrentTime) / 60
                  );

                  if (
                    totalMinutesNowActuallyElapsed > minutesElapsedRef.current
                  ) {
                    const minutesNewlyPassedWhileHidden =
                      totalMinutesNowActuallyElapsed -
                      minutesElapsedRef.current;
                    const newCoinsToAdd = minutesNewlyPassedWhileHidden * 1;
                    if (newCoinsToAdd > 0) {
                      console.log(
                        `VisibilityChange: Partial pomodoro (hidden). Awarding ${newCoinsToAdd} coins for ${minutesNewlyPassedWhileHidden} new minutes.`
                      );
                      saveCoinsToDatabase(newCoinsToAdd);
                      setCoins((prev) => prev + newCoinsToAdd);
                    }
                    minutesElapsedRef.current = totalMinutesNowActuallyElapsed;
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

    // Add page focus handler to detect sleep mode recovery
    const handlePageFocus = () => {
      // Check if we're recovering from sleep mode
      const lastFocusTime = sessionStorage.getItem("lastFocusTime");
      const now = Date.now();

      if (lastFocusTime) {
        const timeSinceLastFocus = now - parseInt(lastFocusTime);
        // If more than 30 seconds have passed, likely recovered from sleep
        if (timeSinceLastFocus > 30000) {
          console.log(
            "Detected potential sleep mode recovery, validating state..."
          );
          const savedIsRunning =
            localStorage.getItem("timerIsRunning") === "true";
          const savedTime = localStorage.getItem("timerTime");

          // If timer was running but time is invalid, reset
          if (savedIsRunning && (!savedTime || savedTime <= 0)) {
            console.log("Invalid timer state after sleep, resetting...");
            localStorage.setItem("timerIsRunning", "false");
            localStorage.setItem("timerShowStart", "true");
            localStorage.removeItem("timerStartedAt");
            window.location.reload();
            return;
          }
        }
      }

      sessionStorage.setItem("lastFocusTime", now.toString());
    };

    window.addEventListener("focus", handlePageFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
      window.removeEventListener("blur", () => {});
      window.removeEventListener("focus", handlePageFocus);
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
    minutesElapsedRef.current,
  ]);

  // --- BACKGROUND TIMER MODE TRANSITION AND COUNTDOWN WHEN APP IS HIDDEN ---
  useEffect(() => {
    let bgInterval = null;
    function backgroundModeTransitionCheck() {
      if (document.visibilityState === "hidden") {
        // Read timer state from localStorage to avoid stale closure
        const modeLS = localStorage.getItem("timerMode") || "pomodoro";
        const isBreakLS = localStorage.getItem("timerIsBreak") === "true";
        const isRunningLS = localStorage.getItem("timerIsRunning") === "true";
        let timeLS = parseInt(localStorage.getItem("timerTime") || "0", 10);
        const pomodoroTimeLS = parseInt(
          localStorage.getItem("timerPomodoroTime") || "1500",
          10
        );
        const breakTimeLS = parseInt(
          localStorage.getItem("timerBreakTime") || "300",
          10
        );
        const cyclesLS = parseInt(
          localStorage.getItem("timerCycles") || "1",
          10
        );
        const currentCycleLS = parseInt(
          localStorage.getItem("timerCurrentCycle") || "0",
          10
        );
        let lastTick = parseInt(
          localStorage.getItem("timerLastBgTick") || "0",
          10
        );
        const now = Date.now();

        // Decrement timer if running and time > 0
        if (isRunningLS && timeLS > 0) {
          // Only decrement once per second
          if (!lastTick || now - lastTick >= 1000) {
            timeLS = Math.max(0, timeLS - 1);
            localStorage.setItem("timerTime", timeLS.toString());
            localStorage.setItem("timerLastBgTick", now.toString());
            // Optionally, fire a custom event for React to sync
            window.dispatchEvent(new Event("timerBgTick"));
          }
        }

        // If timer reached 0, trigger transition
        if (isRunningLS && timeLS === 0) {
          if (modeLS === "pomodoro") {
            if (!isBreakLS) {
              // Pomodoro finished, go to break
              if (currentCycleLS + 1 < cyclesLS) {
                localStorage.setItem(
                  "timerCurrentCycle",
                  (currentCycleLS + 1).toString()
                );
                localStorage.setItem("timerIsBreak", "true");
                localStorage.setItem("timerIsRunning", "true");
                localStorage.setItem("timerShowStart", "false");
                localStorage.setItem("timerStartedAt", now.toString());
                localStorage.setItem("timerTime", breakTimeLS.toString());
                window.dispatchEvent(new Event("timerModeAutoTransition"));
              } else if (currentCycleLS + 1 === cyclesLS) {
                // Last Pomodoro, do a final break
                localStorage.setItem(
                  "timerCurrentCycle",
                  (currentCycleLS + 1).toString()
                );
                localStorage.setItem("timerIsBreak", "true");
                localStorage.setItem("timerIsRunning", "true");
                localStorage.setItem("timerShowStart", "false");
                localStorage.setItem("timerStartedAt", now.toString());
                localStorage.setItem("timerTime", breakTimeLS.toString());
                window.dispatchEvent(new Event("timerModeAutoTransition"));
              }
            } else {
              // Break finished, go to next pomodoro
              if (currentCycleLS < cyclesLS) {
                localStorage.setItem("timerIsBreak", "false");
                localStorage.setItem("timerIsRunning", "true");
                localStorage.setItem("timerShowStart", "false");
                localStorage.setItem("timerStartedAt", now.toString());
                localStorage.setItem("timerTime", pomodoroTimeLS.toString());
                window.dispatchEvent(new Event("timerModeAutoTransition"));
              } else {
                // All cycles and breaks done, reset
                localStorage.setItem("timerIsBreak", "false");
                localStorage.setItem("timerIsRunning", "false");
                localStorage.setItem("timerShowStart", "true");
                localStorage.setItem("timerCurrentCycle", "0");
                localStorage.setItem("timerStartedAt", "");
                localStorage.setItem("timerTime", pomodoroTimeLS.toString());
                window.dispatchEvent(new Event("timerModeAutoTransition"));
              }
            }
          }
        }
      }
    }
    bgInterval = setInterval(backgroundModeTransitionCheck, 1000);
    return () => {
      if (bgInterval) clearInterval(bgInterval);
    };
  }, []);

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
    minutesElapsedRef.current = 0;
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

    // Save any accumulated time from unsavedSessionSeconds before resetting
    if (unsavedSessionSecondsRef.current > 0) {
      saveTimeSpentToDatabase(unsavedSessionSecondsRef.current);
      // unsavedSessionSecondsRef.current will be reset in saveTimeSpentToDatabase
    }

    setShowStart(true);
    setIsBreak(false);
    setCurrentCycle(0);
    setInitialTime(null);
    minutesElapsedRef.current = 0;
    setPauseStartTime(null); // Reset pause start time
    setTotalPausedTime(0); // Reset total paused time

    // Ensure pomodoroTime, countdownTime have valid defaults if not loaded from settings
    if (mode === "pomodoro") setTime(pomodoroTime || 25 * 60); // Fallback if pomodoroTime is 0/null
    if (mode === "countdown") setTime(countdownTime || 10 * 60); // Fallback if countdownTime is 0/null
    if (mode === "stopwatch") setTime(0);
    setCoins(0);

    window.dispatchEvent(new Event("coinUpdate"));
  };

  // Update handleModeChange to work with timestamps and prevent switching when running
  const handleModeChange = (newMode) => {
    // Prevent mode change if timer is running
    if (isRunning) {
      return;
    }

    // Pause current timer (redundant with the check above, but kept for safety)
    setIsRunning(false);
    setShowStart(true);
    setTimerStartedAt(null);
    setInitialTime(null);
    minutesElapsedRef.current = 0;

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

    // Dispatch a custom event to notify other components that timer settings have been updated
    window.dispatchEvent(new Event("timerSettingsUpdate"));
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

      // Dispatch event to update estimated time in todo component
      window.dispatchEvent(new Event("pomodoroCompleted"));
    } catch (error) {
      console.error("Failed to complete pomodoro:", error);
    }
  };

  const [finalBreak, setFinalBreak] = useState(false);

  // Helper: Start a Pomodoro session
  const startPomodoro = () => {
    setIsBreak(false);
    setTime(pomodoroTime);
    setShowStart(false);
    setIsRunning(true);
    setTimerStartedAt(Date.now());
    setInitialTime(pomodoroTime);
    minutesElapsedRef.current = 0;
    setFinalBreak(false);
  };

  // Helper: Start a Break session
  const startBreak = (isFinal = false) => {
    setIsBreak(true);
    setTime(breakTime);
    setShowStart(false);
    setIsRunning(true);
    setTimerStartedAt(Date.now());
    setInitialTime(breakTime);
    minutesElapsedRef.current = 0;
    setFinalBreak(isFinal);
  };

  // Enhanced timer completion logic (robust cycles)
  useEffect(() => {
    if (mode !== "stopwatch" && time === 0 && isRunning) {
      setIsRunning(false);
      setShowStart(true);
      notificationSound.play().catch(() => {});
      if (mode === "pomodoro") {
        if (!isBreak) {
          // Pomodoro just finished, award coins and save time
          onPomodoroEnd();
          saveTimeSpentToDatabase(unsavedSessionSecondsRef.current);
          unsavedSessionSecondsRef.current = 0;
          // Award only remaining unawarded minutes at 1 coin/min
          const minutesInSession = Math.floor(pomodoroTime / 60);
          const remainingMinutes = Math.max(
            0,
            minutesInSession - minutesElapsedRef.current
          );
          if (remainingMinutes > 0) {
            const coinsForCompletion = remainingMinutes * 1;
            saveCoinsToDatabase(coinsForCompletion);
            setCoins((prev) => prev + coinsForCompletion);
            minutesElapsedRef.current = minutesInSession;
          }
          // Handle cycles
          if (currentCycle + 1 < cycles) {
            setTimeout(() => {
              setCurrentCycle((prev) => prev + 1);
              startBreak(false);
            }, 1000); // 1s delay for UX
          } else if (currentCycle + 1 === cycles) {
            // Last Pomodoro, do a final break
            setTimeout(() => {
              setCurrentCycle((prev) => prev + 1);
              startBreak(true);
            }, 1000);
          }
        } else {
          // Break just finished
          if (!finalBreak) {
            setTimeout(() => {
              startPomodoro();
            }, 1000);
          } else {
            // All cycles and breaks done, reset to default Pomodoro state
            setTimeout(() => {
              setIsBreak(false);
              setCurrentCycle(0);
              setTime(pomodoroTime);
              setShowStart(true);
              setIsRunning(false);
              setTimerStartedAt(null);
              setInitialTime(null);
              minutesElapsedRef.current = 0;
              setFinalBreak(false);
            }, 1000);
          }
        }
      } else if (mode === "countdown") {
        // Countdown reached zero while visible: award remaining minutes and reset to initial time
        const minutesInSession = initialTime
          ? Math.floor(initialTime / 60)
          : Math.floor((countdownTime || 0) / 60);
        if (minutesInSession > 0) {
          const remainingMinutes = Math.max(
            0,
            minutesInSession - minutesElapsedRef.current
          );
          if (remainingMinutes > 0) {
            const coinsForCompletion = remainingMinutes * 1;
            saveCoinsToDatabase(coinsForCompletion);
            setCoins((prev) => prev + coinsForCompletion);
            minutesElapsedRef.current = minutesInSession;
          }
        }
        setInitialTime(null);
        setTimerStartedAt(null);
        minutesElapsedRef.current = 0;
        setTime(countdownTime);
      }
    }
    // eslint-disable-next-line
  }, [time, isRunning]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedSessionSecondsRef.current > 0) {
        // Synchronous XHR is deprecated, but fetch/axios is unreliable in beforeunload. We'll use navigator.sendBeacon if available.
        const token = localStorage.getItem("token");
        if (token) {
          const adjustedTime = Math.round(
            unsavedSessionSecondsRef.current / 1.9
          );
          if (adjustedTime > 0) {
            const data = JSON.stringify({ timeSpentInSeconds: adjustedTime });
            if (navigator.sendBeacon) {
              navigator.sendBeacon(
                "/api/user-activity/update-time-spent",
                new Blob([data], { type: "application/json" })
              );
            } else {
              // Fallback: synchronous XHR (deprecated, but works in all browsers)
              const xhr = new XMLHttpRequest();
              xhr.open("POST", "/api/user-activity/update-time-spent", false);
              xhr.setRequestHeader("Content-Type", "application/json");
              xhr.setRequestHeader("Authorization", `Bearer ${token}`);
              xhr.send(data);
            }
          }
        }
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Optionally, listen for 'timerModeAutoTransition' event in React to force sync state
  useEffect(() => {
    function syncFromLocalStorage() {
      setMode(localStorage.getItem("timerMode") || "pomodoro");
      setIsBreak(localStorage.getItem("timerIsBreak") === "true");
      setIsRunning(localStorage.getItem("timerIsRunning") === "true");
      setShowStart(localStorage.getItem("timerShowStart") !== "false");
      setTimerStartedAt(
        localStorage.getItem("timerStartedAt")
          ? parseInt(localStorage.getItem("timerStartedAt"))
          : null
      );
      setTime(
        localStorage.getItem("timerTime")
          ? parseInt(localStorage.getItem("timerTime"))
          : 25 * 60
      );
      setCurrentCycle(
        localStorage.getItem("timerCurrentCycle")
          ? parseInt(localStorage.getItem("timerCurrentCycle"))
          : 0
      );
    }
    window.addEventListener("timerModeAutoTransition", syncFromLocalStorage);
    return () =>
      window.removeEventListener(
        "timerModeAutoTransition",
        syncFromLocalStorage
      );
  }, []);

  // Optionally, listen for 'timerBgTick' event in React to force sync state
  useEffect(() => {
    function syncFromLocalStorageTick() {
      setTime(
        localStorage.getItem("timerTime")
          ? parseInt(localStorage.getItem("timerTime"))
          : 25 * 60
      );
    }
    window.addEventListener("timerBgTick", syncFromLocalStorageTick);
    return () =>
      window.removeEventListener("timerBgTick", syncFromLocalStorageTick);
  }, []);

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
        <div className="relative">
          <motion.button
            className={`flex-1 px-3 py-1 md:px-5 md:py-3 text-sm md:text-base rounded-full transition-all duration-300 min-w-[90px] md:min-w-[110px] ${
              isRunning ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            } ${
              isBreak
                ? "bg-gray-300 text-gray-700"
                : mode === "pomodoro"
                ? "bg-[#FFE3A6] text-black"
                : theme === "dark"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
            onClick={() => !isRunning && handleModeChange("pomodoro")}
            whileHover={isRunning ? {} : { y: -2 }}
            whileTap={isRunning ? {} : { y: 1 }}
            transition={{ duration: 0 }}
            disabled={isRunning}
            title={isRunning ? "Pause the timer to switch modes" : ""}
          >
            {isBreak ? "Break" : "Pomodoro"}
          </motion.button>
        </div>
        <div className="relative">
          <motion.button
            className={`flex-1 px-3 py-1 md:px-5 md:py-3 text-sm md:text-base rounded-full transition-all duration-300 min-w-[90px] md:min-w-[110px] ${
              isRunning ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            } ${
              mode === "countdown"
                ? "bg-[#FFE3A6] text-black"
                : theme === "dark"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
            onClick={() => !isRunning && handleModeChange("countdown")}
            whileHover={isRunning ? {} : { y: -2 }}
            whileTap={isRunning ? {} : { y: 1 }}
            transition={{ duration: 0 }}
            disabled={isRunning}
            title={isRunning ? "Pause the timer to switch modes" : ""}
          >
            Countdown
          </motion.button>
          {isRunning && (
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
              Pause to switch
            </div>
          )}
        </div>
        <div className="relative">
          <motion.button
            className={`flex-1 px-3 py-1 md:px-5 md:py-3 text-sm md:text-base rounded-full transition-all duration-300 min-w-[90px] md:min-w-[110px] ${
              isRunning ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            } ${
              mode === "stopwatch"
                ? "bg-[#FFE3A6] text-black"
                : theme === "dark"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
            onClick={() => !isRunning && handleModeChange("stopwatch")}
            whileHover={isRunning ? {} : { y: -2 }}
            whileTap={isRunning ? {} : { y: 1 }}
            transition={{ duration: 0 }}
            disabled={isRunning}
            title={isRunning ? "Pause the timer to switch modes" : ""}
          >
            Timer
          </motion.button>
        </div>
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
                <Timer size={20} className="hidden md:block" />{" "}
                {/* Hide on mobile */}
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
                    <RefreshCcw size={20} className="hidden md:block" />{" "}
                    {/* Hide on mobile */}
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
                <Pause size={20} className="hidden md:block" />{" "}
                {/* Hide on mobile */}
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
                <RefreshCcw size={20} className="hidden md:block" />{" "}
                {/* Hide on mobile */}
                <span className="text-base md:text-lg font-medium">Reset</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSettingsOpen(true)}
          className="timer-control-button timer-settings-button flex items-center justify-center ml-2" // Added margin-left
        >
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ duration: 0.2 }}
          >
            <Settings size={20} />
          </motion.div>
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
