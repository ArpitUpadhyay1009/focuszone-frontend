import "./todo.css";
import { useEffect, useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import confetti from 'canvas-confetti';
import {useSelectedTask} from "@context/SelectedTaskContext.jsx";

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
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("/api/tasks", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("Fetched tasks:", res.data.ongoingTasks);
        setTasks(
          res.data.ongoingTasks.map((task) => {
            let pomodoros = "0";

            if (typeof task.estimatedPomodoros === "string") {
              pomodoros = task.estimatedPomodoros;
            }

            let date;
            try {
              date = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : new Date().toLocaleDateString();
            } catch (e) {
              date = new Date().toLocaleDateString();
            }

            return {
              id: task._id,
              taskName: task.taskName,
              date,
              pomodoros,
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

    if (token) {
      fetchTasks();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (tasks.length === 0) {
      setSelectedTaskId(null);
    } else if (!selectedTaskId) {
      // Select the last added task by default
      setSelectedTaskId(tasks[tasks.length - 1].id);
    } else if (tasks.length === 1) {
      // If only one task, keep it selected (even if clicked again)
      setSelectedTaskId(tasks[0].id);
    }
    // We skip adding selectedTaskId in dependencies to avoid infinite loop here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  useEffect(() => {
    console.log("Selected Task ID changed to:", selectedTaskId);
  }, [selectedTaskId]);

  const addTask = async () => {
    if (tasks.length >= 100) {
      alert("You have reached the maximum limit of 100 tasks. Please delete or complete some tasks to add more.");
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
  
        console.log("Pomodoros from API:", res.data.task.estimatedPomodoros);
        console.log("Pomodoros set in state:", pomodoros);
  
        let date;
        try {
          date = res.data.task.dueDate ? new Date(res.data.task.dueDate).toLocaleDateString() : new Date().toLocaleDateString();
        } catch (e) {
          date = new Date().toLocaleDateString();
        }
  
        setTasks((prev) => [
          ...prev,
          {
            id: res.data.task._id,
            taskName: res.data.task.taskName,
            date,
            pomodoros, // Ensure this is set correctly
            status: "ongoing",
          },
        ]);
  
        setNewTask({ name: "", date: today, pomodoros: "" });
        setIsOpen(false);
      } catch (error) {
        console.error("Failed to add task:", error.message);
      }
    }
  };

  const toggleTaskStatus = async (taskId) => {
    try {
      const res = await axios.patch(
        `/api/tasks/${taskId}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, status: task.status === "finished" ? "ongoing" : "finished" }
            : task
        )
      );
      setIntermediateTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId
            ? { ...task, status: task.status === "ongoing" ? "finished" : "ongoing" }
            : task
        )
      );
    } catch (error) {
      console.error("Error toggling task status:", error.message);
    }
  };
  
  const deleteTask = async (taskId) => {
    try {
      console.log("Trying to delete:", taskId);
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setIntermediateTasks((prevTasks) => prevTasks.filter((task) => task._id!== taskId));
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };
  
  useEffect(() => {
    async function fetchRemainingPomodoros() {
      try {
        const res = await axios.get('/api/tasks/remaining-pomodoros'); // Your actual API route
        const remainingPomodoros = res.data.remainingPomodoros || 0;

        const DEFAULT_POMODORO_SECONDS = 1500; // 25 * 60
        const pomodoroLength = (parseInt(localStorage.getItem('timerTime'), 10) || DEFAULT_POMODORO_SECONDS) / 60;

        console.log("Pomodoro time: " + localStorage.getItem("timerTime"))
        console.log("pomodoro length is: " + pomodoroLength)

        const completionDate = new Date();
        completionDate.setMinutes(completionDate.getMinutes() + remainingPomodoros * pomodoroLength);

        const hours = completionDate.getHours();
        const minutes = completionDate.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;

        setEstimatedTime(`${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`);
        console.log("Estimated time set to:", estimatedTime); // Log the value to check if it is being set correctly
      } catch (error) {
        console.error("Failed to fetch remaining pomodoros", error);
        setEstimatedTime("N/A");
      }
    }

    fetchRemainingPomodoros();
  }, []);

  async function handleTaskCompletion(taskId) {
    try {
      // Call backend to toggle task
      await axios.patch(`/api/tasks/${taskId}/toggle`);
  
      // Then update local state
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === taskId) {
          if (!task.completed) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
          return { ...task, completed: !task.completed };
        }
        return task;
      }));
    } catch (error) {
      console.error("Error toggling task:", error.response?.data || error.message);
    }
  }

  useEffect(() => {
    const fetchIntermediateTasks = async () => {
      try {
        const response = await fetch('/api/tasks/intermediate', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Ensure you have the token available
          }
        });
        const data = await response.json();
        setIntermediateTasks(data.intermediateTasks);
      } catch (error) {
        console.error('Error fetching intermediate tasks:', error);
      }
    };
    fetchIntermediateTasks();
  }, []);

  async function handleIntermediateTaskCompletion(taskId) {
    try {
        // Call backend to toggle task
        await axios.patch(`/api/${taskId}/toggle`);

        // Then update local state
        setIntermediateTasks(prevTasks => prevTasks.map(task => {
            if (task._id === taskId) {
                if (!task.completed) {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
                return { ...task, completed: !task.completed };
            }
            return task;
        }));
    } catch (error) {
        console.error("Error toggling intermediate task:", error.response?.data || error.message);
    }
}

async function refetchCurrentTasks() {
  // Example using fetch API
  setIsLoading(true);
      try {
        const res = await axios.get("/api/tasks", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("Fetched tasks:", res.data.ongoingTasks);
        setTasks(
          res.data.ongoingTasks.map((task) => {
            let pomodoros = "0";
            let completedPomodoros = "0";

            if (typeof task.estimatedPomodoros === "string") {
              pomodoros = task.estimatedPomodoros;
            }

            if (typeof task.completedPomodoros === "string") {
              completedPomodoros = task.completedPomodoros;
            }

            console.log("completed pomodoros are: " + completedPomodoros)

            let date;
            try {
              date = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : new Date().toLocaleDateString();
            } catch (e) {
              date = new Date().toLocaleDateString();
            }

            return {
              id: task._id,
              taskName: task.taskName,
              date,
              pomodoros,
              completedPomodoros,
              status: task.status || "ongoing",
            };
          })
        );
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
      } finally {
        setIsLoading(false);
      }
}

async function refetchIntermediateTasks() {
  // Example using fetch API
  try {
    const response = await fetch('/api/tasks/intermediate', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Ensure you have the token available
      }
    });
    const data = await response.json();
    setIntermediateTasks(data.intermediateTasks);
  } catch (error) {
    console.error('Error fetching intermediate tasks:', error);
  }
}

  return (
    <>
      <div className="todo-container flex flex-col items-center">
      <div className="task-manager-container p-4 mx-auto text-center" style={{ width: '60vw' }}>
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
            <motion.ul 
              className="task-list compact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {tasks.length === 0 ? (
                <motion.li
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4 opacity-70 italic"
                >
                  No tasks yet. Add one to get started!
                </motion.li>
              ) : (
                tasks.map((task) => (

                  <motion.li
                    key={task.id}
                    className={`task-item ${theme === "dark" ? "dark" : "light"} ${task.status === "finished" ? "completed" : ""} ${selectedTaskId === task.id ? "selected-task" : ""}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                      if (tasks.length > 1) {
                        setSelectedTaskId(task.id);
                      } else if (isOnlyOneTask) {
                        // If only one task, clicking it does not deselect
                        setSelectedTaskId(task.id);
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      name={`task-${task.id}`}
                      checked={task.status === "finished" && task.completed}
                      onChange={() => {toggleTaskStatus(task.id);
                        handleTaskCompletion(task.id);
                        setTimeout(() => {
                          refetchIntermediateTasks();
                          refetchCurrentTasks();
                      }, 1500);
                      }}
                      className="task-checkbox"
                    />
                    <div className="task-content">
                      <p className={`task-name ${task.status === "finished" ? "finished" : ""}`}>
                        {task.taskName}
                      </p>
                      <p className="task-details">
                        {task.status === "finished"
                          ? "Completed"
                          : `Due: ${task.date || new Date().toLocaleDateString()} | Est. Pomodoros: ${task.pomodoros}`}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteTask(task.id)}
                      className="task-delete"
                    >
                      <FaTrash size={14} />
                    </motion.button>
                  </motion.li>
                ))
              )}
            </motion.ul>
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

        <h2 className="text-xl font-bold mb-3 mt-3">Completed tasks</h2>

        <motion.ul>
              {intermediateTasks.map((task) => (
                <motion.li
                  key={task._id}
                  className={`checked-item ${theme === "dark" ? "dark" : "light"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                      type="checkbox"
                      name={`task-${task.id}`}
                      checked={task.status === "ongoing" && !task.completed}
                      onChange={() => {toggleTaskStatus(task._id);
                        handleIntermediateTaskCompletion(task._id);
                        setTimeout(() => {
                          refetchCurrentTasks();
                          refetchIntermediateTasks();
                      }, 500);
                      }}
                      className="checked-checkbox"
                    />
                  <div className="task-content">
                    <p className="checked-name">{task.taskName}</p>
                    <p className="task-details">completed</p>
                  </div>
                  <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteTask(task._id)}
                      className="task-delete"
                    >
                      <FaTrash size={14} />
                    </motion.button>
                </motion.li>
              ))}
          </motion.ul>

        <AnimatePresence>
          {isOpen && (
            <Dialog
              as="div"
              className="fixed inset-0 flex items-center justify-center"
              open={isOpen}
              onClose={() => setIsOpen(false)}
            >
              <motion.div
                className="fixed inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsOpen(false)}
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
                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                className={`relative p-5 rounded-lg shadow-md w-96 ${
                  theme === "dark" ? "bg-black text-white" : "bg-white"
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
                  value={newTask.date || today}
                  onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
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
                    const value = Math.max(0, Math.min(100, Number(e.target.value)));
                    setNewTask({ ...newTask, pomodoros: value });
                  }}
                  className="w-full p-2 border rounded mb-2"
                />
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
                    onClick={addTask}
                  >
                    Add
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
        <p>
          Estimated Completion Time: {estimatedTime}
        </p>
      </motion.div>
    </div>
    </>
    );
}