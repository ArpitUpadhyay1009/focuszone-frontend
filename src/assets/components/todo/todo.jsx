import "./todo.css";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FaTrash, FaPlus, FaPencilAlt } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import confetti from "canvas-confetti";
import { useSelectedTask } from "@context/SelectedTaskContext.jsx";

// Separate AddTaskModal component to isolate modal state
const AddTaskModal = React.memo(({ isOpen, onClose, onAddTask, theme }) => {
  const [newTask, setNewTask] = useState({
    name: "",
    date: getTodayISO(),
    pomodoros: "",
    priority: "",
  });
  const [charCount, setCharCount] = useState(0);

  const handleAddTask = () => {
    if (newTask.name.trim()) {
      onAddTask(newTask);
      setNewTask({
        name: "",
        date: getTodayISO(),
        pomodoros: "",
        priority: "",
      });
      setCharCount(0);
      onClose();
    }
  };

  const handleClose = () => {
    setNewTask({
      name: "",
      date: getTodayISO(),
      pomodoros: "",
      priority: "",
    });
    setCharCount(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as={motion.div}
          open={isOpen}
          onClose={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`relative p-6 rounded-lg shadow-xl max-w-md w-full mx-4 ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-800"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-3">New Task</h2>
            <label className="relative">
              Enter task:
              <span className="text-red-500 absolute top-0 right-[-1]">*</span>
            </label>
            {charCount > 0 && (
              <p className="text-sm text-gray-600 mb-1">Character limit: 200</p>
            )}
            <input
              type="text"
              placeholder="Task Name"
              value={newTask.name}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 200) {
                  setNewTask({ ...newTask, name: value });
                  setCharCount(value.length);
                }
              }}
              className="w-full p-2 border rounded mb-2"
            />
            <label>Enter date of completion:</label>
            <input
              type="date"
              value={newTask.date || getTodayISO()}
              onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
              className="w-full p-2 border rounded mb-2"
              min={getTodayISO()}
            />
            <label>Estimated number of pomodoros:</label>
            <input
              type="number"
              placeholder="Pomodoros"
              value={newTask.pomodoros}
              min={0}
              max={100}
              onChange={(e) => {
                const value = Math.max(
                  0,
                  Math.min(100, Number(e.target.value))
                );
                setNewTask({ ...newTask, pomodoros: value });
              }}
              className="w-full p-2 border rounded mb-2"
            />
            <label>Priority</label>
            <select
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
              className={`w-full p-2 border rounded mb-2 ${
                theme === "dark"
                  ? "text-white bg-gray-800"
                  : "text-gray-800 bg-white"
              }`}
            >
              <option value="must do">Must Do</option>
              <option value="can do">Can Do</option>
            </select>
            <div className="flex justify-end gap-2 mt-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="modal-button cancel-button px-3 py-1.5 rounded-md"
                onClick={handleClose}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="modal-button add-button px-3 py-1.5 rounded-md"
                onClick={handleAddTask}
              >
                Add
              </motion.button>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
});

// Separate EditTaskModal component to isolate modal state
const EditTaskModal = React.memo(
  ({ isOpen, onClose, onUpdateTask, task, theme }) => {
    const [editTask, setEditTask] = useState({
      id: "",
      name: "",
      date: getTodayISO(),
      pomodoros: "",
      priority: "",
    });

    // Update editTask when task prop changes
    useEffect(() => {
      if (task) {
        setEditTask({
          id: task.id,
          name: task.taskName,
          date: toISODateString(task.dueDate || task.date),
          pomodoros: task.pomodoros,
          priority: task.priority,
        });
      }
    }, [task]);

    const handleUpdateTask = () => {
      if (editTask.name.trim()) {
        onUpdateTask(editTask);
        onClose();
      }
    };

    const handleClose = () => {
      onClose();
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <Dialog
            open={isOpen}
            onClose={handleClose}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-0"
              onClick={handleClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`modal-content p-6 rounded-lg shadow-lg max-w-md w-full mx-4 z-10 relative ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-800"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">Edit Task</h2>
              <label>Task name:</label>
              <input
                type="text"
                placeholder="Enter task name"
                value={editTask.name}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 200) {
                    setEditTask({ ...editTask, name: value });
                  }
                }}
                className="w-full p-2 border rounded mb-2"
              />
              <label>Enter date of completion:</label>
              <input
                type="date"
                value={editTask.date || getTodayISO()}
                onChange={(e) =>
                  setEditTask({ ...editTask, date: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
                min={getTodayISO()}
              />
              <label>Estimated number of pomodoros:</label>
              <input
                type="number"
                placeholder="Pomodoros"
                value={editTask.pomodoros}
                min={0}
                max={100}
                onChange={(e) => {
                  const value = Math.max(
                    0,
                    Math.min(100, Number(e.target.value))
                  );
                  setEditTask({ ...editTask, pomodoros: value });
                }}
                className="w-full p-2 border rounded mb-2"
              />
              <label>Priority</label>
              <select
                value={editTask.priority}
                onChange={(e) =>
                  setEditTask({ ...editTask, priority: e.target.value })
                }
                className={`w-full p-2 border rounded mb-2 ${
                  theme === "dark"
                    ? "text-white bg-gray-800"
                    : "text-gray-800 bg-white"
                }`}
              >
                <option value="must do">Must Do</option>
                <option value="can do">Can Do</option>
              </select>
              <div className="flex justify-end gap-2 mt-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="modal-button cancel-button px-3 py-1.5 rounded-md"
                  onClick={handleClose}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="modal-button add-button px-3 py-1.5 rounded-md"
                  onClick={handleUpdateTask}
                >
                  Update
                </motion.button>
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    );
  }
);

export default function TodoList() {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [intermediateTasks, setIntermediateTasks] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const { selectedTaskId, setSelectedTaskId } = useSelectedTask();
  const [estimatedTime, setEstimatedTime] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTaskData, setEditTaskData] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const token = localStorage.getItem("token");

  async function fetchRemainingPomodoros() {
    try {
      const res = await axios.get("/api/tasks/remaining-pomodoros", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const remainingCount = res.data.remainingPomodoros || 0;
      console.log("Remaining pomodoros:", remainingCount);

      // Store the remaining count for local calculations
      setRemainingPomodoros(remainingCount);

      // Calculate and set the estimated time
      calculateEstimatedTime(remainingCount);
    } catch (error) {
      console.error("Failed to fetch remaining pomodoros", error);
      setEstimatedTime("N/A");
    }
  }

  // Move fetchTasks outside useEffect so it can be called from event handlers
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(
        res.data.ongoingTasks.map((task) => {
          let pomodoros = "0";
          if (typeof task.estimatedPomodoros === "string") {
            pomodoros = task.estimatedPomodoros;
          }

          let completedPomodoros = "0";
          if (typeof task.completedPomodoros === "string") {
            completedPomodoros = task.completedPomodoros;
          }

          let date;
          try {
            date = task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : new Date().toLocaleDateString();
          } catch (e) {
            date = new Date().toLocaleDateString();
          }

          return {
            id: task._id,
            taskName: task.taskName,
            date,
            pomodoros,
            completedPomodoros,
            priority: task.priority || "must do",
            status: task.status || "ongoing",
          };
        })
      );
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIntermediateTasks = async () => {
    try {
      const res = await axios.get("/api/tasks/intermediate", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIntermediateTasks(
        res.data.intermediateTasks.map((task) => ({
          id: task._id,
          taskName: task.taskName,
          date: task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : new Date().toLocaleDateString(),
          pomodoros: task.estimatedPomodoros || "0",
          priority: task.priority || "must do",
          status: "finished",
        }))
      );
    } catch (error) {
      console.error("Error fetching intermediate tasks:", error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchIntermediateTasks();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  // Handle selectedTaskId logic only when tasks are initially loaded or when tasks are added/removed
  useEffect(() => {
    if (tasks.length === 0) {
      setSelectedTaskId(null);
    } else if (!selectedTaskId && tasks.length > 0) {
      setSelectedTaskId(tasks[tasks.length - 1].id);
    }
  }, [tasks.length]); // Only depend on tasks.length, not selectedTaskId

  // Memoize filtered task lists to prevent unnecessary re-renders
  const mustDoTasks = useMemo(
    () => tasks.filter((task) => task.priority === "must do"),
    [tasks]
  );

  const canDoTasks = useMemo(
    () => tasks.filter((task) => task.priority === "can do"),
    [tasks]
  );

  const mustDoIntermediateTasks = useMemo(
    () => intermediateTasks.filter((task) => task.priority === "must do"),
    [intermediateTasks]
  );

  const canDoIntermediateTasks = useMemo(
    () => intermediateTasks.filter((task) => task.priority === "can do"),
    [intermediateTasks]
  );

  // Memoize the entire task sections to prevent re-renders when modal state changes
  const taskSections = useMemo(
    () => ({
      mustDoTasks,
      canDoTasks,
      mustDoIntermediateTasks,
      canDoIntermediateTasks,
    }),
    [mustDoTasks, canDoTasks, mustDoIntermediateTasks, canDoIntermediateTasks]
  );

  // Memoized click handler to prevent re-renders
  const handleTaskClick = useCallback((taskId) => {
    setSelectedTaskId(taskId);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Store remaining pomodoros count for local time calculations
  const [remainingPomodoros, setRemainingPomodoros] = useState(0);

  // Function to calculate estimated time locally without API call
  const calculateEstimatedTime = (remainingCount) => {
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

    setEstimatedTime(
      `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`
    );
  };

  // Auto-update estimated time every minute (local calculation only)
  useEffect(() => {
    const updateEstimatedTimeLocally = () => {
      calculateEstimatedTime(remainingPomodoros);
    };

    // Set up interval to update every minute (60000ms)
    const interval = setInterval(updateEstimatedTimeLocally, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [remainingPomodoros]);

  const addTask = useCallback(
    async (newTaskData) => {
      if (tasks.length >= 100) {
        alert(
          "You have reached the maximum limit of 100 tasks. Please delete or complete some tasks to add more."
        );
        return;
      }

      if (newTaskData.name.trim()) {
        try {
          // Always send date in ISO format
          const isoDate = new Date(newTaskData.date)
            .toISOString()
            .split("T")[0];
          const res = await axios.post(
            "/api/tasks",
            {
              taskName: newTaskData.name,
              dueDate: isoDate,
              estimatedPomodoros: newTaskData.pomodoros || "0",
              priority: newTaskData.priority || "must do",
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          let pomodoros = "0";
          if (res.data.task.estimatedPomodoros) {
            pomodoros = res.data.task.estimatedPomodoros;
          }

          let date;
          try {
            date = res.data.task.dueDate
              ? toISODateString(res.data.task.dueDate)
              : getTodayISO();
          } catch (e) {
            date = getTodayISO();
          }

          setTasks((prev) => [
            ...prev,
            {
              id: res.data.task._id,
              taskName: res.data.task.taskName,
              date,
              pomodoros,
              completedPomodoros: res.data.task.completedPomodoros || "0",
              priority: res.data.task.priority || "must do",
              status: "ongoing",
            },
          ]);

          fetchRemainingPomodoros();
        } catch (error) {
          console.error("Failed to add task:", error.message);
        }
      }
    },
    [tasks.length, fetchRemainingPomodoros]
  );

  const toggleTaskStatus = useCallback(
    async (taskId) => {
      const isOngoing = tasks.some((task) => task.id === taskId);
      let toggledTask;

      if (isOngoing) {
        toggledTask = tasks.find((task) => task.id === taskId);
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        setIntermediateTasks((prev) => [
          ...prev,
          { ...toggledTask, status: "finished" },
        ]);
      } else {
        toggledTask = intermediateTasks.find((task) => task.id === taskId);
        setIntermediateTasks((prev) =>
          prev.filter((task) => task.id !== taskId)
        );
        setTasks((prev) => [
          ...prev,
          {
            ...toggledTask,
            status: "ongoing",
            completedPomodoros: toggledTask.completedPomodoros || "0",
          },
        ]);
      }

      try {
        await axios.patch(
          `/api/tasks/${taskId}/toggle`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // Only update remaining pomodoros, not the whole task list
        fetchRemainingPomodoros();
        // Wait a moment for backend to update, then dispatch event
        setTimeout(() => {
          window.dispatchEvent(new Event("taskCompletionUpdate"));
        }, 300);
        // Do NOT call fetchTasks() or fetchIntermediateTasks() here!
      } catch (error) {
        // Revert optimistic update if error
        if (isOngoing) {
          setIntermediateTasks((prev) =>
            prev.filter((task) => task.id !== taskId)
          );
          setTasks((prev) => [...prev, toggledTask]);
        } else {
          setTasks((prev) => prev.filter((task) => task.id !== taskId));
          setIntermediateTasks((prev) => [...prev, toggledTask]);
        }
        alert("Failed to toggle task status. Please try again.");
      }
    },
    [tasks, intermediateTasks, fetchRemainingPomodoros]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      try {
        await axios.delete(`/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        // Remove from both arrays
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        setIntermediateTasks((prev) =>
          prev.filter((task) => task.id !== taskId)
        );
        fetchRemainingPomodoros();
        window.dispatchEvent(new Event("taskCompletionUpdate"));
      } catch (error) {
        console.error("Error deleting task:", error.message);
      }
    },
    [fetchRemainingPomodoros]
  );

  const openEditModal = useCallback((task) => {
    setEditTaskData(task);
    setIsEditOpen(true);
  }, []);

  const updateTask = useCallback(
    async (editTaskData) => {
      if (editTaskData.name.trim()) {
        try {
          // Always send date in ISO format
          const isoDate = new Date(editTaskData.date)
            .toISOString()
            .split("T")[0];
          console.log("Updating task with ID:", editTaskData.id);
          const res = await axios.patch(
            `/api/tasks/${editTaskData.id}/edit`,
            {
              taskName: editTaskData.name,
              dueDate: isoDate,
              estimatedPomodoros: editTaskData.pomodoros || "0",
              priority: editTaskData.priority || "must do",
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          // Update the task in the local state
          setTasks((prev) =>
            prev.map((task) =>
              task.id === editTaskData.id
                ? {
                    ...task,
                    taskName: editTaskData.name,
                    date: editTaskData.date,
                    pomodoros: editTaskData.pomodoros || "0",
                    priority: editTaskData.priority || "must do",
                  }
                : task
            )
          );

          fetchRemainingPomodoros();
        } catch (error) {
          console.error("Failed to update task:", error.message);
        }
      }
    },
    [fetchRemainingPomodoros]
  );

  // Reorder tasks function using the new API endpoint
  const reorderTasks = useCallback(
    async (orderedTasks) => {
      try {
        console.log('Reordering tasks:', orderedTasks);
        const response = await axios.patch(
          '/api/tasks/reorder',
          { orderedTasks }, // Changed to match the API expectation
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              'Content-Type': 'application/json'
            },
          }
        );

        console.log('Reorder response:', response.data);

        // Update tasks with the response from the server
        if (response.data && response.data.ongoingTasks) {
          // Format tasks to match our expected format
          const formattedTasks = response.data.ongoingTasks.map(task => {
            // Format date consistently with fetchTasks function
            let date;
            try {
              date = task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : new Date().toLocaleDateString();
            } catch (e) {
              date = new Date().toLocaleDateString();
            }
            
            return {
              id: task._id,
              taskName: task.taskName,
              date,
              pomodoros: task.estimatedPomodoros,
              completedPomodoros: task.completedPomodoros,
              priority: task.priority,
              status: 'ongoing',
              order: task.order
            };
          });
          
          setTasks(formattedTasks);
          fetchRemainingPomodoros();
        }
      } catch (error) {
        console.error("Error reordering tasks:", error.response?.data || error.message);
        // Refresh tasks to ensure UI is in sync with server
        fetchTasks();
      }
    },
    [fetchRemainingPomodoros, fetchTasks]
  );

  // Drag and Drop Functions

  const toggleTaskPriority = useCallback(
    async (taskId, newPriority) => {
      try {
        // Find the task in tasks array
        const task = tasks.find((t) => t.id === taskId);
        
        if (!task) {
          console.error('Task not found');
          return;
        }
        
        // Optimistic UI update
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === taskId ? { ...t, priority: newPriority } : t
          )
        );

        // Create ordered tasks array with updated priority
        const orderedTasks = tasks.map((t, index) => ({
          id: t.id,
          priority: t.id === taskId ? newPriority : t.priority,
          order: index
        }));

        // Use the new reorderTasks function to update the backend
        await reorderTasks(orderedTasks);
      } catch (error) {
        console.error("Error updating task priority:", error);
        // Revert the optimistic update in case of error
        fetchTasks();
      }
    },
    [tasks, reorderTasks, fetchTasks]
  );

  const handleDragStart = useCallback((e, taskId) => {
    console.log('Drag started with task ID:', taskId);
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
    
    // Add a dragging class to improve visual feedback
    const element = e.target.closest('.task-item');
    if (element) {
      element.classList.add('dragging');
      setTimeout(() => {
        element.classList.remove('dragging');
      }, 0);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    // Add visual feedback for the drop zone
    const dropZone = e.currentTarget;
    if (dropZone && !dropZone.classList.contains('drag-over')) {
      dropZone.classList.add('drag-over');
    }
  }, []);
  
  // Add dragLeave handler to remove visual feedback
  const handleDragLeave = useCallback((e) => {
    const dropZone = e.currentTarget;
    if (dropZone) {
      dropZone.classList.remove('drag-over');
    }
  }, []);

  const handleDrop = useCallback(
    (e, targetPriority) => {
      e.preventDefault();
      console.log('Drop event triggered');
      
      // Remove drag-over class for visual feedback
      const dropZone = e.currentTarget;
      if (dropZone) {
        dropZone.classList.remove('drag-over');
      }
      
      // Get the task ID from dataTransfer
      const taskId = e.dataTransfer.getData("text/plain");
      console.log('Task ID from dataTransfer:', taskId);
      
      if (!taskId) {
        console.error('No task ID found in dataTransfer');
        return;
      }
      
      // Check in tasks array
      const task = tasks.find((t) => t.id === taskId);
      
      if (!task) {
        console.error('Task not found in tasks array');
        return;
      }
      
      console.log('Found task:', task);
      console.log('Target priority:', targetPriority);

      // Get the target element (where we're dropping)
      const targetElement = e.target.closest('.task-item');
      const targetTaskId = targetElement ? targetElement.getAttribute('data-task-id') : null;
      
      console.log('Target element:', targetElement);
      console.log('Target task ID:', targetTaskId);
      
      // Create a copy of tasks to reorder
      let orderedTasks = [...tasks];
      
      // If priority is changing
      if (task.priority !== targetPriority) {
        console.log('Updating task priority');
        
        // Get tasks with the target priority
        const tasksWithTargetPriority = orderedTasks.filter(t => t.priority === targetPriority);
        
        // Update the priority of the dragged task
        const updatedTask = { ...task, priority: targetPriority };
        
        // Remove the task from its current position
        orderedTasks = orderedTasks.filter(t => t.id !== taskId);
        
        // If dropping on a specific task, insert at that position
        if (targetTaskId && targetTaskId !== taskId) {
          const targetIndex = orderedTasks.findIndex(t => t.id === targetTaskId);
          if (targetIndex !== -1) {
            // Insert at the target position
            orderedTasks.splice(targetIndex, 0, updatedTask);
          } else {
            // Add to the end of tasks with the target priority
            const lastTargetPriorityIndex = orderedTasks.reduce((lastIndex, t, index) => {
              return t.priority === targetPriority ? index : lastIndex;
            }, -1);
            
            if (lastTargetPriorityIndex !== -1) {
              orderedTasks.splice(lastTargetPriorityIndex + 1, 0, updatedTask);
            } else {
              // If no tasks with target priority, add to the beginning
              orderedTasks.push(updatedTask);
            }
          }
        } else {
          // If dropping on the section (not on a task), add to the end of that section
          if (tasksWithTargetPriority.length > 0) {
            const lastTargetPriorityIndex = orderedTasks.reduce((lastIndex, t, index) => {
              return t.priority === targetPriority ? index : lastIndex;
            }, -1);
            
            orderedTasks.splice(lastTargetPriorityIndex + 1, 0, updatedTask);
          } else {
            // If no tasks with target priority, add to the end
            orderedTasks.push(updatedTask);
          }
        }
        
        // Update UI optimistically
        setTasks(orderedTasks);
      } 
      // If we're reordering within the same priority section
      else if (targetTaskId && targetTaskId !== taskId) {
        console.log('Reordering tasks within same priority');
        
        // Find the indices of the dragged and target tasks
        const draggedIndex = orderedTasks.findIndex(t => t.id === taskId);
        const targetIndex = orderedTasks.findIndex(t => t.id === targetTaskId);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
          // Remove the dragged task from the array
          const [draggedTask] = orderedTasks.splice(draggedIndex, 1);
          
          // Insert it at the target position
          orderedTasks.splice(targetIndex, 0, draggedTask);
          
          // Update UI optimistically
          setTasks(orderedTasks);
        }
      }
      
      // Prepare the ordered tasks array for the API call
      const tasksForApi = orderedTasks.map((t, index) => ({
        id: t.id,
        priority: t.priority,
        order: index
      }));
      
      console.log('Sending to API:', tasksForApi);
      
      // Call the reorderTasks function to update the backend
      reorderTasks(tasksForApi);
    },
    [tasks, reorderTasks, setTasks]
  );

  const handleTaskCompletion = useCallback(async (taskId) => {
    try {
      await axios.patch(`/api/tasks/${taskId}/toggle`);
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === taskId) {
            if (!task.completed) {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
              });
            }
            return { ...task, completed: !task.completed };
          }
          return task;
        })
      );
    } catch (error) {
      console.error(
        "Error toggling task:",
        error.response?.data || error.message
      );
    }
  }, []);

  useEffect(() => {
    fetchRemainingPomodoros();
  }, []);

  // Listen for timer settings updates to recalculate estimated time
  useEffect(() => {
    const handleTimerSettingsUpdate = () => {
      fetchRemainingPomodoros();
    };

    const handlePomodoroCompleted = () => {
      fetchRemainingPomodoros();
      fetchTasks(); // Refresh task data to show updated completedPomodoros
    };

    window.addEventListener("timerSettingsUpdate", handleTimerSettingsUpdate);
    window.addEventListener("pomodoroCompleted", handlePomodoroCompleted);

    return () => {
      window.removeEventListener(
        "timerSettingsUpdate",
        handleTimerSettingsUpdate
      );
      window.removeEventListener("pomodoroCompleted", handlePomodoroCompleted);
    };
  }, []);

  // Memoized Task Sections Component to isolate from modal state changes
  const TaskSections = React.memo(
    ({
      mustDoTasks,
      canDoTasks,
      mustDoIntermediateTasks,
      canDoIntermediateTasks,
      onTaskClick,
      onToggleStatus,
      onEditTask,
      onDeleteTask,
      onDragStart,
      onDragOver,
      onDragLeave,
      onDrop,
    }) => (
      <>
        {/* Must Do Section */}
        <div
          className="drop-zone must-do-zone p-4 border-2 border-dashed border-transparent rounded-lg transition-all duration-300 hover:border-blue-300 hover:bg-blue-500/10 dark:hover:bg-blue-500/20"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, "must do")}
        >
          <h3 className="text-lg font-semibold mb-3 text-left text-red-600 dark:text-red-400">
            🔥 Must Do
          </h3>
          <motion.ul className="space-y-2">
            {mustDoTasks.length === 0 &&
            mustDoIntermediateTasks.length === 0 ? (
              <motion.li>
                No must-do tasks. Drop tasks here to make them high priority.
              </motion.li>
            ) : (
              <>
                {mustDoTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    section="must-do"
                    onTaskClick={onTaskClick}
                    onToggleStatus={onToggleStatus}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onDragStart={onDragStart}
                  />
                ))}
                {mustDoIntermediateTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    section="must-do"
                    isIntermediate
                    onTaskClick={onTaskClick}
                    onToggleStatus={onToggleStatus}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onDragStart={onDragStart}
                  />
                ))}
              </>
            )}
          </motion.ul>
        </div>

        {/* Can Do Section */}
        <div
          className="drop-zone can-do-zone p-4 border-2 border-dashed border-transparent rounded-lg transition-all duration-300 hover:border-green-300 hover:bg-green-500/10 dark:hover:bg-green-500/20"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, "can do")}
        >
          <h3 className="text-lg font-semibold mb-3 text-left text-green-600 dark:text-green-400">
            ✅ Can Do
          </h3>
          <motion.ul className="space-y-2">
            {canDoTasks.length === 0 && canDoIntermediateTasks.length === 0 ? (
              <motion.li
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-4 opacity-70 italic border-2 border-dashed border-gray-300 rounded-lg"
              >
                No can-do tasks. Drop tasks here for lower priority.
              </motion.li>
            ) : (
              <>
                {canDoTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    section="can-do"
                    onTaskClick={onTaskClick}
                    onToggleStatus={onToggleStatus}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onDragStart={onDragStart}
                  />
                ))}
                {canDoIntermediateTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    section="can-do"
                    isIntermediate
                    onTaskClick={onTaskClick}
                    onToggleStatus={onToggleStatus}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onDragStart={onDragStart}
                  />
                ))}
              </>
            )}
          </motion.ul>
        </div>
      </>
    )
  );

  const TaskItem = React.memo(
    ({
      task,
      section,
      isIntermediate,
      onTaskClick,
      onToggleStatus,
      onEditTask,
      onDeleteTask,
      onDragStart,
    }) => (
      <motion.li
        key={task.id}
        draggable="true"
        data-task-id={task.id}
        onDragStart={(e) => onDragStart(e, task.id)}
        onDragEnd={(e) => {
          const element = e.target.closest('.task-item');
          if (element) {
            element.classList.remove('dragging');
          }
        }}
        className={`task-item ${theme === "dark" ? "dark" : "light"} ${
          task.status === "finished" ? "completed" : ""
        } ${
          selectedTaskId === task.id ? "selected-task" : ""
        } cursor-move hover:shadow-lg transition-shadow`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        onClick={() => onTaskClick(task.id)}
      >
        <input
          type="checkbox"
          name={`task-${task.id}`}
          checked={isIntermediate || task.status === "finished"}
          onChange={() => onToggleStatus(task.id)}
          className="task-checkbox"
        />
        <div className="task-content">
          <p
            className={`task-name ${
              task.status === "finished" ? "finished" : ""
            }`}
          >
            {task.taskName}
          </p>
          <p className="task-details">
            {task.status === "finished"
              ? "Completed"
              : `Due: ${
                  task.date || new Date().toLocaleDateString()
                } | Est. Pomodoros: ${task.completedPomodoros}/${
                  task.pomodoros
                }`}
          </p>
        </div>
        <div className="task-actions">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onEditTask(task);
            }}
            className="task-edit"
            title="Edit task"
          >
            <FaPencilAlt size={14} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTask(task.id);
            }}
            className="task-delete"
            title="Delete task"
          >
            <FaTrash size={14} />
          </motion.button>
        </div>
      </motion.li>
    )
  );

  return (
    <>
      <div className="todo-container flex flex-col items-center">
        <div
          className="task-manager-container p-4 mx-auto text-center w-[92vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[55vw] max-w-4xl"
          style={{
            minWidth: windowWidth >= 1024 ? "700px" : "320px",
          }}
        >
          <h2 className="text-xl font-bold mb-3">Task Manager</h2>
          <AnimatePresence>
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4"
              >
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2">Loading tasks...</p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {tasks.length === 0 && intermediateTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-4 opacity-70 italic"
                  >
                    No tasks yet. Add one to get started!
                  </motion.div>
                ) : (
                  <TaskSections
                    mustDoTasks={mustDoTasks}
                    canDoTasks={canDoTasks}
                    mustDoIntermediateTasks={mustDoIntermediateTasks}
                    canDoIntermediateTasks={canDoIntermediateTasks}
                    onTaskClick={handleTaskClick}
                    onToggleStatus={toggleTaskStatus}
                    onEditTask={openEditModal}
                    onDeleteTask={deleteTask}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  />
                )}
              </div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="add-task-button mt-4 px-4 py-2 rounded-full font-medium flex items-center justify-center gap-2 mx-auto"
            onClick={() => setIsOpen(true)}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaPlus size={14} />
            </motion.div>
            <span>Add Task</span>
          </motion.button>

          {/* Separate Modal Components */}
          <AddTaskModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onAddTask={addTask}
            theme={theme}
          />

          <EditTaskModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onUpdateTask={updateTask}
            task={editTaskData}
            theme={theme}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="info-box mt-2 p-1 border rounded text-xs"
        >
          <p>Estimated Completion Time: {estimatedTime}</p>
        </motion.div>
      </div>
    </>
  );
}

// Helper to get today's date in ISO format
const getTodayISO = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Helper to convert any date to ISO string (YYYY-MM-DD)
function toISODateString(date) {
  if (!date) return getTodayISO();
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  if (date instanceof Date) return date.toISOString().split("T")[0];
  const d = new Date(date);
  if (!isNaN(d)) return d.toISOString().split("T")[0];
  return getTodayISO();
}
