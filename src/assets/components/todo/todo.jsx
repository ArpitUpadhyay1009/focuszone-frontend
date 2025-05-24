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
  const today = new Date().toISOString().split("T")[0];
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
              name: task.taskName,
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

        if (typeof res.data.task.estimatedPomodoros === "string") {
          pomodoros = res.data.task.estimatedPomodoros;
        }

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
            name: res.data.task.taskName,
            date,
            pomodoros,
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
  );
}
