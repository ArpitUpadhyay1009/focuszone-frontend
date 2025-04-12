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
  const [isOpen, setIsOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    date: "",
    hours: "",
    minutes: "",
  });

  const token = localStorage.getItem("token");

  // 📌 Fetch tasks on mount
  // 📌 Fetch tasks on mount
  // ... existing code ...

  // ... existing code ...

  useEffect(() => {
    const fetchTasks = async () => {
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

            const date = new Date(task.dueDate).toLocaleDateString();

            return {
              id: task._id,
              name: task.taskName,
              date,
              hours,
              minutes,
              status: "ongoing",
            };
          })
        );
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
      }
    };

    fetchTasks();
  }, [token]);

  const addTask = async () => {
    if (
      newTask.name.trim() &&
      newTask.date &&
      (newTask.hours || newTask.minutes)
    ) {
      try {
        const estimatedTime = {
          hours: newTask.hours || "0",
          minutes: newTask.minutes || "0",
        };

        const res = await axios.post(
          "/api/tasks",
          {
            taskName: newTask.name,
            dueDate: newTask.date,
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

        const date = new Date(res.data.task.dueDate).toLocaleDateString();

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

        setNewTask({ name: "", date: "", hours: "", minutes: "" });
        setIsOpen(false);
      } catch (error) {
        console.error("Failed to add task:", error.message);
      }
    }
  };

  // 📌 Delete task from backend
  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error.message);
    }
  };

  // 📌 Mark as completed
  const toggleTaskStatus = async (id) => {
    try {
      await axios.patch(`/api/tasks/${id}/complete`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Update the task status to "finished"
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, status: "finished" } : task
        )
      );
      // Add a delay of 3 seconds before removing the task from the list
      setTimeout(() => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      }, 3000);
    } catch (error) {
      console.error("Failed to complete task:", error.message);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto text-center">
      <ul className="mt-6 space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-center p-3 ${
              theme === "dark"
                ? "bg-purple-300 border-purple-600 border-2"
                : "bg-[#FFE3A6] border-orange-600 border-2"
            }  rounded shadow space-x-3`}
          >
            <input
              type="radio"
              name={`task-${task.id}`}
              checked={task.status === "finished"}
              onChange={() => toggleTaskStatus(task.id)}
              className="w-5 h-5 cursor-pointer"
            />
            <div className="flex-1 flex justify-between items-center">
              <p
                className={`font-semibold ${
                  task.status === "finished" ? "line-through text-gray-500" : ""
                }`}
              >
                {task.name}
              </p>
              <p
                className={`text-sm ${
                  task.status === "finished"
                    ? theme === "dark"
                      ? "text-purple-600"
                      : "text-green-600"
                    : "text-gray-600"
                }`}
              >
                {task.status === "finished"
                  ? "Finished"
                  : `Due: ${task.date} | Est. Time: ${task.hours}h ${task.minutes}m`}
              </p>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash size={18} />
            </button>
          </li>
        ))}
      </ul>

      {/* Add Task Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className={`mt-4 ${
          theme === "dark"
            ? "bg-purple-400 border-white border-2 text-white"
            : "bg-orange-300 border-orange-600 border-2 text-orange-500"
        } px-4 py-2 rounded-md shadow flex items-center gap-2 mx-auto`}
        onClick={() => setIsOpen(true)}
      >
        <FaPlus size={16} /> Add Task
      </motion.button>

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
              className="fixed inset-0 bg-transparent bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`relative p-6 rounded-lg shadow-md w-96 ${
                theme === "dark" ? "bg-black text-white" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">New Task</h2>
              <label>Enter task:</label>
              <input
                type="text"
                placeholder="Task Name"
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <label>Enter date of completion:</label>
              <input
                type="date"
                value={newTask.date}
                onChange={(e) =>
                  setNewTask({ ...newTask, date: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <label>Estimated time of completion:</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Hours"
                  value={newTask.hours}
                  onChange={(e) =>
                    setNewTask({ ...newTask, hours: e.target.value })
                  }
                  className="w-1/2 p-2 border rounded mb-2"
                />
                <input
                  type="number"
                  placeholder="Minutes"
                  value={newTask.minutes}
                  onChange={(e) =>
                    setNewTask({ ...newTask, minutes: e.target.value })
                  }
                  className="w-1/2 p-2 border rounded mb-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className={` px-4 py-2 rounded ${
                    theme === "dark"
                      ? "bg-[#7500CA] text-white"
                      : "bg-[#7500CA] text-white"
                  }`}
                  onClick={addTask}
                >
                  Add
                </button>
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
