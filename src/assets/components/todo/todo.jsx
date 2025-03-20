import "./todo.css";
import { useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

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

  const addTask = () => {
    if (
      newTask.name.trim() &&
      newTask.date &&
      (newTask.hours || newTask.minutes)
    ) {
      setTasks((prevTasks) => [
        ...prevTasks,
        { ...newTask, id: Date.now(), status: "ongoing" },
      ]);
      setNewTask({ name: "", date: "", hours: "", minutes: "" });
      setIsOpen(false);
    }
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const toggleTaskStatus = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "finished" ? "ongoing" : "finished",
            }
          : task
      )
    );
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
              onClick={() => setIsOpen(false)} // ✅ Click outside closes modal
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`relative p-6 rounded-lg shadow-md w-96 ${
                theme === "dark" ? "bg-black text-white" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()} // ✅ Prevent closing on modal click
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
