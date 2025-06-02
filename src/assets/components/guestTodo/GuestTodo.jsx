import "./GuestTodo.css";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";

const GuestTodoList = () => {
  const { theme } = useTheme();
  const today = new Date().toISOString().split("T")[0];
  const [charCount, setCharCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', date: today, pomodoros: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const [isOpen, setIsOpen] = useState(false);

  // Load guest tasks from sessionStorage on mount
  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem("guestTasks")) || [];
    setTasks(saved);
  }, []);

  // Save tasks to sessionStorage whenever tasks change
  useEffect(() => {
    sessionStorage.setItem("guestTasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (!newTask.name?.trim()) return;
  
    const task = {
      id: Date.now(),
      taskName: newTask.name.trim(),
      date: newTask.date || new Date().toLocaleDateString(),
      pomodoros: newTask.pomodoros || "0",
      completed: false,
    };
  
    setTasks((prev) => [...prev, task]);
  
    // Reset fields
    setNewTask({ name: "", date: today, pomodoros: "" });
    setCharCount(0);
    setIsOpen(false);
  };
  

  const toggleTaskCompletion = (taskId) => {
    const updated = tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
  };

  const deleteTask = (taskId) => {
    const updated = tasks.filter(t => t.id !== taskId);
    setTasks(updated);
  };

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
                    checked={task.status === "finished" && task.completed}
                    onChange={() => {toggleTaskCompletion(task.id);
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

      <AnimatePresence>
        {isOpen && (
          <Dialog
            as="div"
            className="fixed inset-0 z-10 flex items-center justify-center"
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
                  onClick={handleAddTask}
                >
                  Add
                </motion.button>
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  </div>
  </>
  );
};

export default GuestTodoList;
