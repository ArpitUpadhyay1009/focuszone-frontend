import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const EstimatedTimeDisplay = React.memo(({ theme }) => {
  const [estimatedTime, setEstimatedTime] = useState("Loading...");

  // Store remaining pomodoros count for local time calculations
  const remainingPomodorosRef = useRef(0);

  // Function to calculate estimated time locally without API call
  const calculateEstimatedTime = useCallback((remainingCount) => {
    const DEFAULT_POMODORO_SECONDS = 1500;
    const pomodoroLength =
      (parseInt(localStorage.getItem("timerTime"), 10) ||
        DEFAULT_POMODORO_SECONDS) / 60;

    const completionDate = new Date();
    completionDate.setMinutes(
      completionDate.getMinutes() + remainingCount * pomodoroLength
    );

    const hours = completionDate.getHours();
    const minutes = completionDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;
  }, []);

  // Fetch remaining pomodoros from API
  const fetchRemainingPomodoros = useCallback(async () => {
    try {
      const res = await axios.get("/api/tasks/remaining-pomodoros", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const remainingCount = res.data.remainingPomodoros || 0;

      // Store the remaining count for local calculations
      remainingPomodorosRef.current = remainingCount;

      // Calculate and set the estimated time
      const time = calculateEstimatedTime(remainingCount);
      setEstimatedTime(time);
    } catch (error) {
      console.error("Failed to fetch remaining pomodoros", error);
      setEstimatedTime("N/A");
    }
  }, [calculateEstimatedTime]);

  // Auto-update estimated time every minute (local calculation only)
  useEffect(() => {
    const updateEstimatedTimeLocally = () => {
      const time = calculateEstimatedTime(remainingPomodorosRef.current);
      setEstimatedTime(time);
    };

    // Set up interval to update every minute (60000ms)
    const interval = setInterval(updateEstimatedTimeLocally, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [calculateEstimatedTime]);

  // Listen for task completion updates
  useEffect(() => {
    // Initial fetch
    fetchRemainingPomodoros();

    const handleTaskCompletionUpdate = () => {
      // Only fetch from API when explicitly triggered by an event
      // that indicates a real change in task status
      fetchRemainingPomodoros();
    };

    const handleTimerSettingsUpdate = () => {
      // When timer settings change, we need to recalculate
      const time = calculateEstimatedTime(remainingPomodorosRef.current);
      setEstimatedTime(time);
    };

    const handlePomodoroCompleted = () => {
      // When a pomodoro is completed, decrement the count and recalculate
      remainingPomodorosRef.current = Math.max(
        0,
        remainingPomodorosRef.current - 1
      );
      const time = calculateEstimatedTime(remainingPomodorosRef.current);
      setEstimatedTime(time);
    };

    window.addEventListener("taskCompletionUpdate", handleTaskCompletionUpdate);
    window.addEventListener("timerSettingsUpdate", handleTimerSettingsUpdate);
    window.addEventListener("pomodoroCompleted", handlePomodoroCompleted);

    return () => {
      window.removeEventListener(
        "taskCompletionUpdate",
        handleTaskCompletionUpdate
      );
      window.removeEventListener(
        "timerSettingsUpdate",
        handleTimerSettingsUpdate
      );
      window.removeEventListener("pomodoroCompleted", handlePomodoroCompleted);
    };
  }, [fetchRemainingPomodoros, calculateEstimatedTime]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="info-box mt-2 p-1 border rounded text-xs"
    >
      <p>Estimated Completion Time: {estimatedTime}</p>
    </motion.div>
  );
});

export default EstimatedTimeDisplay;
