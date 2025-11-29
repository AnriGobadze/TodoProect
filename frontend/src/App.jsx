import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const BASE_URL = "http://localhost:5000/api/todos";

  // Fetch all tasks from backend
  const loadTasks = async () => {
    try {
      const response = await axios.get(BASE_URL);
      setTasks(response.data);
    } catch {
      toast.error("Could not fetch tasks 😅");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return toast.warn("Please enter a task");

    try {
      const response = await axios.post(BASE_URL, { title: newTask });
      setTasks([...tasks, response.data]);
      setNewTask("");
      toast.success("Task added successfully!");
    } catch {
      toast.error("Failed to add task");
    }
  };

  // Delete a task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
      toast.info("Task removed 🗑️");
    } catch {
      toast.error("Could not delete task");
    }
  };

  // Toggle completion
  const handleToggle = async (id) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`);
      const updatedTask = response.data.todo;
      setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)));
    } catch {
      toast.error("Failed to update task");
    }
  };

  return (
    <div className="app">

      <form onSubmit={handleAddTask} className="todo-form">
        <input
          type="text"
          placeholder="Type a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <ul className="todo-list">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.li
              key={task._id}
              className={`todo-item ${task.completed ? "completed" : ""}`}
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
            >
              <span>{task.title}</span>

              <div className="todo-actions">
                <button
                  className={`toggle-btn ${task.completed ? "undo" : "done"}`}
                  onClick={() => handleToggle(task._id)}
                >
                  {task.completed ? "✔️" : "⭕"}
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(task._id)}
                >
                  <FaTrash />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <ToastContainer />
    </div>
  );
}

export default TaskManager;
