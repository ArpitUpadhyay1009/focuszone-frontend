import "./todo.css";
import { useEffect, useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function TodoList() {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const [newTask, setNewTask] = useState({
    name: "",
    date: today, // Set the default date to today's date
    hours: "",
    minutes: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("/api/tasks", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTasks(
          res.data.ongoingTasks.map((task) => {
            let hours = "0";
            let minutes = "0";

            if (typeof task.estimatedTime === "string") {
              const timeMatch = task.estimatedTime.match(
                /(\d+)\s*hours?\s*(\d+)\s*minutes?/i
              );
              if (timeMatch) {
                hours = timeMatch[1];
                minutes = timeMatch[2];
              }
            }

            // Ensure we have a valid date or use current date
            let date;
            try {
              date = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : new Date().toLocaleDateString();
            } catch (e) {
              date = new Date().toLocaleDateString();
            }

            return {
              id: task._id,
              name: task.taskName,
              date,
              hours,
              minutes,
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

  const addTask = async () => {
    if (tasks.length >= 100) {
      alert("You have reached the maximum limit of 100 tasks. Please delete or complete some tasks to add more.");
      return;
    }

    if (newTask.name.trim()) {
      try {
        const estimatedTime = {
          hours: newTask.hours || "0",
          minutes: newTask.minutes || "0",
        };

        // Ensure we have a valid date or use current date
        const taskDate = newTask.date || today;

        const res = await axios.post(
          "/api/tasks",
          {
            taskName: newTask.name,
            dueDate: taskDate,
            estimatedTime,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        let hours = "0";
        let minutes = "0";

        if (typeof res.data.task.estimatedTime === "string") {
          const timeMatch = res.data.task.estimatedTime.match(
            /(\d+)\s*hours?\s*(\d+)\s*minutes?/i
          );
          if (timeMatch) {
            hours = timeMatch[1];
            minutes = timeMatch[2];
          }
        }

        // Ensure we have a valid date from the response or use current date
        let date;
        try {
          date = res.data.task.dueDate ? new Date(res.data.task.dueDate).toLocaleDateString() : new Date().toLocaleDateString();
        } catch (e) {
          date = new Date().toLocaleDateString();
        }

        // Ensure the task ID is correctly set
        setTasks((prev) => [
          ...prev,
          {
            id: res.data.task._id, // Ensure this ID is correctly set
            name: res.data.task.taskName,
            date,
            hours,
            minutes,
            status: "ongoing",
          },
        ]);

        setNewTask({ name: "", date: today, hours: "", minutes: "" });
        setIsOpen(false);
      } catch (error) {
        console.error("Failed to add task:", error.message);
      }
    }
  };

  // 📌 Delete task from backend
  const deleteTask = async (id) => {
    try {
      // Log the ID for debugging
      console.log("Attempting to delete task with ID:", id);
      
      // Check if the ID is valid
      if (!id) {
        console.error("Invalid task ID");
        return;
      }
      
      // Make the API call with proper error handling
      const response = await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      // If successful, update the UI
      if (response.status === 200 || response.status === 204) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
        console.log("Task deleted successfully");
      }
    } catch (error) {
      // More detailed error logging
      console.error("Failed to delete task:", error.response ? {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url
      } : error.message);
      
      // Even if the API call fails, remove the task from UI for better UX
      setTasks((prev) => prev.filter((task) => task.id !== id));
    }
  };

  // 📌 Mark as completed
  const toggleTaskStatus = async (id) => {
    try {
      await axios.patch(`/api/tasks/${id}/complete`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Update the task status to "finished" but don't remove it
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id 
            ? { ...task, status: task.status === "finished" ? "ongoing" : "finished" } 
            : task
        )
      );
      // Removed the setTimeout that was deleting the task
    } catch (error) {
      console.error("Failed to complete task:", error.message);
    }
  };

  return (
    <div className="task-manager-container p-4 max-w-lg mx-auto text-center">
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
                  className={`task-item ${theme === "dark" ? "dark" : "light"} ${task.status === "finished" ? "completed" : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="checkbox"
                    name={`task-${task.id}`}
                    checked={task.status === "finished"}
                    onChange={() => toggleTaskStatus(task.id)}
                    className="task-checkbox"
                  />
                  <div className="task-content">
                    <p className={`task-name ${task.status === "finished" ? "finished" : ""}`}>
                      {task.name}
                    </p>
                    
                    <p className="task-details">
                      {task.status === "finished"
                        ? "Completed"
                        : `Due: ${task.date || new Date().toLocaleDateString()} | Est. Time: ${
                            task.hours === "0" && task.minutes === "0" 
                              ? "Unlimited" 
                              : `${task.hours}h ${task.minutes}m`
                          }`}
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

      {/* Updated Add Task Button */}
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

      {/* Your existing dialog code */}
      <AnimatePresence>
        {isOpen && (
          <Dialog
            as="div"
            className="fixed inset-0 flex items-center justify-center"
            open={isOpen}
            onClose={() => setIsOpen(false)}
          >
            {/* Backdrop */}
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

            {/* Modal */}
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
                <span className="text-red-500 absolute top-0 right-[-1]">*</span> {/* Red asterisk */}
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
                    setCharCount(value.length); // Update character count
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
                min={new Date().toISOString().split("T")[0]} // Set the minimum date to today's date
              />
              <label>Estimated time of completion:</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Hours"
                  value={newTask.hours}
                  min={0}
                  max={120}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(120, Number(e.target.value)));
                    setNewTask({ ...newTask, hours: value });
                  }}
                  className="w-1/2 p-2 border rounded mb-2"
                />
                <input
                  type="number"
                  placeholder="Minutes"
                  value={newTask.minutes}
                  min={0}
                  max={59}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(59, Number(e.target.value)));
                    setNewTask({ ...newTask, minutes: value });
                  }}
                  className="w-1/2 p-2 border rounded mb-2"
                />
              </div>
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
  );
}
