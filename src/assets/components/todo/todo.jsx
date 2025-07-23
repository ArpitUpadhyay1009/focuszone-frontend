import "./todo.css";
import { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaPencilAlt } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import confetti from "canvas-confetti";
import { useSelectedTask } from "@context/SelectedTaskContext.jsx";

export default function TodoList() {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [intermediateTasks, setIntermediateTasks] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const { selectedTaskId, setSelectedTaskId } = useSelectedTask();
  const [estimatedTime, setEstimatedTime] = useState("");
  const [newTask, setNewTask] = useState({
    name: "",
    date: today,
    pomodoros: "",
    completedPomodoros: "",
    priority: "",
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTask, setEditTask] = useState({
    id: "",
    name: "",
    date: today,
    pomodoros: "",
    priority: "",
  });
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

  useEffect(() => {
    if (tasks.length === 0) {
      setSelectedTaskId(null);
    } else if (!selectedTaskId) {
      setSelectedTaskId(tasks[tasks.length - 1].id);
    } else if (tasks.length === 1) {
      setSelectedTaskId(tasks[0].id);
    }
  }, [tasks]);

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

  const addTask = async () => {
    if (tasks.length >= 100) {
      alert(
        "You have reached the maximum limit of 100 tasks. Please delete or complete some tasks to add more."
      );
      return;
    }

    if (newTask.name.trim()) {
      try {
        const res = await axios.post(
          "/api/tasks",
          {
            taskName: newTask.name,
            dueDate: newTask.date,
            estimatedPomodoros: newTask.pomodoros || "0",
            priority: newTask.priority || "must do",
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
            ? new Date(res.data.task.dueDate).toLocaleDateString()
            : new Date().toLocaleDateString();
        } catch (e) {
          date = new Date().toLocaleDateString();
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

        setNewTask({ name: "", date: today, pomodoros: "", priority: "" });
        fetchRemainingPomodoros();
        setIsOpen(false);
      } catch (error) {
        console.error("Failed to add task:", error.message);
      }
    }
  };

  const toggleTaskStatus = async (taskId) => {
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
      setIntermediateTasks((prev) => prev.filter((task) => task.id !== taskId));
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
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // Only update remaining pomodoros, not the whole task list
      fetchRemainingPomodoros();
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
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Remove from both arrays
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      setIntermediateTasks((prev) => prev.filter((task) => task.id !== taskId));
      fetchRemainingPomodoros();
      window.dispatchEvent(new Event("taskCompletionUpdate"));
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  const openEditModal = (task) => {
    setEditTask({
      id: task.id,
      name: task.taskName,
      date: task.date,
      pomodoros: task.pomodoros,
      priority: task.priority,
    });
    setIsEditOpen(true);
  };

  const updateTask = async () => {
    if (editTask.name.trim()) {
      try {
        console.log("Updating task with ID:", editTask.id);
        const res = await axios.patch(
          `/api/tasks/${editTask.id}/edit`,
          {
            taskName: editTask.name,
            dueDate: editTask.date,
            estimatedPomodoros: editTask.pomodoros || "0",
            priority: editTask.priority || "must do",
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
            task.id === editTask.id
              ? {
                  ...task,
                  taskName: editTask.name,
                  date: editTask.date,
                  pomodoros: editTask.pomodoros || "0",
                  priority: editTask.priority || "must do",
                }
              : task
          )
        );

        setEditTask({
          id: "",
          name: "",
          date: today,
          pomodoros: "",
          priority: "",
        });
        fetchRemainingPomodoros();
        setIsEditOpen(false);
      } catch (error) {
        console.error("Failed to update task:", error.message);
      }
    }
  };

  // Drag and Drop Functions
  const toggleTaskPriority = async (taskId, newPriority) => {
    try {
      await axios.patch(
        `/api/tasks/${taskId}/priority`,
        { priority: newPriority },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, priority: newPriority } : task
        )
      );

      fetchRemainingPomodoros();
    } catch (error) {
      console.error("Error updating task priority:", error.message);
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetPriority) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    const task = tasks.find((t) => t.id === taskId);

    if (task && task.priority !== targetPriority) {
      toggleTaskPriority(taskId, targetPriority);
    }
  };

  const handleTaskCompletion = async (taskId) => {
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
  };

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

  const TaskItem = ({ task, section, isIntermediate }) => (
    <motion.li
      key={task.id}
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
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
      onClick={() => {
        if (tasks.length > 1) {
          setSelectedTaskId(task.id);
        } else if (tasks.length === 1) {
          setSelectedTaskId(task.id);
        }
      }}
    >
      <input
        type="checkbox"
        name={`task-${task.id}`}
        checked={isIntermediate || task.status === "finished"}
        onChange={() => {
          toggleTaskStatus(task.id);
          // Removed fetchTasks() and fetchIntermediateTasks() from here
        }}
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
              } | Est. Pomodoros: ${task.completedPomodoros}/${task.pomodoros}`}
        </p>
      </div>
      <div className="task-actions">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            openEditModal(task);
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
            deleteTask(task.id);
          }}
          className="task-delete"
          title="Delete task"
        >
          <FaTrash size={14} />
        </motion.button>
      </div>
    </motion.li>
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
                  <>
                    {/* Must Do Section */}
                    <div
                      className="drop-zone must-do-zone p-4 border-2 border-dashed border-transparent rounded-lg transition-all duration-300 hover:border-blue-300 hover:bg-blue-500/10 dark:hover:bg-blue-500/20"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, "must do")}
                    >
                      <h3 className="text-lg font-semibold mb-3 text-left text-red-600 dark:text-red-400">
                        🔥 Must Do
                      </h3>
                      <motion.ul className="space-y-2">
                        {tasks.filter((task) => task.priority === "must do")
                          .length === 0 &&
                        intermediateTasks.filter(
                          (task) => task.priority === "must do"
                        ).length === 0 ? (
                          <motion.li>
                            No must-do tasks. Drop tasks here to make them high
                            priority.
                          </motion.li>
                        ) : (
                          <>
                            {tasks
                              .filter((task) => task.priority === "must do")
                              .map((task) => (
                                <TaskItem
                                  key={task.id}
                                  task={task}
                                  section="must-do"
                                />
                              ))}
                            {intermediateTasks
                              .filter((task) => task.priority === "must do")
                              .map((task) => (
                                <TaskItem
                                  key={task.id}
                                  task={task}
                                  section="must-do"
                                  isIntermediate
                                />
                              ))}
                          </>
                        )}
                      </motion.ul>
                    </div>

                    {/* Can Do Section */}
                    <div
                      className="drop-zone can-do-zone p-4 border-2 border-dashed border-transparent rounded-lg transition-all duration-300 hover:border-green-300 hover:bg-green-500/10 dark:hover:bg-green-500/20"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, "can do")}
                    >
                      <h3 className="text-lg font-semibold mb-3 text-left text-green-600 dark:text-green-400">
                        ✅ Can Do
                      </h3>
                      <motion.ul className="space-y-2">
                        {tasks.filter((task) => task.priority === "can do")
                          .length === 0 &&
                        intermediateTasks.filter(
                          (task) => task.priority === "can do"
                        ).length === 0 ? (
                          <motion.li
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-4 opacity-70 italic border-2 border-dashed border-gray-300 rounded-lg"
                          >
                            No can-do tasks. Drop tasks here for lower priority.
                          </motion.li>
                        ) : (
                          <>
                            {tasks
                              .filter((task) => task.priority === "can do")
                              .map((task) => (
                                <TaskItem
                                  key={task.id}
                                  task={task}
                                  section="can-do"
                                />
                              ))}
                            {intermediateTasks
                              .filter((task) => task.priority === "can do")
                              .map((task) => (
                                <TaskItem
                                  key={task.id}
                                  task={task}
                                  section="can-do"
                                  isIntermediate
                                />
                              ))}
                          </>
                        )}
                      </motion.ul>
                    </div>
                  </>
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

          <AnimatePresence>
            {isOpen && (
              <Dialog
                as={motion.div}
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="fixed inset-0 z-50 flex items-center justify-center"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-md"
                  onClick={() => setIsOpen(false)}
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
                    <span className="text-red-500 absolute top-0 right-[-1]">
                      *
                    </span>
                  </label>
                  {charCount > 0 && (
                    <p className="text-sm text-gray-600 mb-1">
                      Character limit: 200
                    </p>
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
                    value={newTask.date || today}
                    onChange={(e) =>
                      setNewTask({ ...newTask, date: e.target.value })
                    }
                    className="w-full p-2 border rounded mb-2"
                    min={new Date().toISOString().split("T")[0]}
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
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="modal-button add-button px-3 py-1.5 rounded-md"
                      onClick={() => {
                        addTask();
                      }}
                    >
                      Add
                    </motion.button>
                  </div>
                </motion.div>
              </Dialog>
            )}
          </AnimatePresence>
        </div>

        {/* Edit Task Modal */}
        <div className="edit-modal-container">
          <AnimatePresence>
            {isEditOpen && (
              <Dialog
                open={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                className="fixed inset-0 z-50 flex items-center justify-center"
              >
                {/* Overlay for background blur */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-md z-0"
                  onClick={() => setIsEditOpen(false)}
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
                    value={editTask.date || today}
                    onChange={(e) =>
                      setEditTask({ ...editTask, date: e.target.value })
                    }
                    className="w-full p-2 border rounded mb-2"
                    min={new Date().toISOString().split("T")[0]}
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
                      onClick={() => setIsEditOpen(false)}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="modal-button add-button px-3 py-1.5 rounded-md"
                      onClick={() => {
                        updateTask();
                      }}
                    >
                      Update
                    </motion.button>
                  </div>
                </motion.div>
              </Dialog>
            )}
          </AnimatePresence>
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
