import "./GuestTodo.css";
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";

const GuestTodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [estimatedPomodoros, setEstimatedPomodoros] = useState("");
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
    if (!taskName.trim()) return;

    const newTask = {
      id: Date.now(),
      taskName,
      date: dueDate || new Date().toLocaleDateString(),
      pomodoros: estimatedPomodoros || "0",
      completed: false,
    };

    setTasks(prev => [...prev, newTask]);
    setTaskName("");
    setDueDate("");
    setEstimatedPomodoros("");
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
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">📝 Guest To-Do List</h2>

      <div className="flex flex-col gap-3 mb-6">
        <AnimatePresence>
    {isOpen && (
        <Dialog
        as="div"
        className="fixed z-10 inset-0 flex items-center justify-center"
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
            className="relative p-5 rounded-lg shadow-md w-96 bg-white"
            onClick={(e) => e.stopPropagation()}
        >
            <h2 className="text-lg font-semibold mb-3">New Task</h2>
            <input
            type="text"
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            />
            <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            />
            <input
            type="number"
            placeholder="Pomodoros"
            value={estimatedPomodoros}
            onChange={(e) => setEstimatedPomodoros(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            />
            <div className="flex justify-end gap-2 mt-3">
            <button
                className="bg-gray-300 px-3 py-1.5 rounded-md"
                onClick={() => setIsOpen(false)}
            >
                Cancel
            </button>
            <button
                className="bg-blue-600 text-white px-3 py-1.5 rounded-md"
                onClick={handleAddTask}
            >
                Add
            </button>
            </div>
        </motion.div>
        </Dialog>
    )}
    </AnimatePresence>
            <button
    onClick={() => setIsOpen(true)}
    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
    >
    Add Task
    </button>
      </div>

      <div>
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                  />
                  <div>
                    <p className={`font-medium ${task.completed ? "line-through text-gray-400" : ""}`}>
                      {task.taskName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due: {task.date} | Pomodoros: {task.pomodoros}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GuestTodoList;
