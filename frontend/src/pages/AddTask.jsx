import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function AddTask() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [priority, setPriority] = useState("medium");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔥 GET USER FROM LOCAL STORAGE
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("User not logged in ❌");
        return;
      }

      console.log("USER:", user); // debug

      await API.post("/tasks", {
        title: title,
        description: description,
        due_date: dueDate,
        subject_id: 1,
        user_id: user.id,        // ✅ MAIN FIX
        priority: priority,      // ✅ REQUIRED
        difficulty: difficulty
      });

      alert("Task Added ✅");

      // reset form
      setTitle("");
      setDescription("");
      setDueDate("");
      setDifficulty("easy");
      setPriority("medium");

      // 🔥 redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Error adding task");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">➕ Add Task</h1>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="date"
          className="w-full p-2 border rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        {/* 🔥 PRIORITY */}
        <select
          className="w-full p-2 border rounded"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* 🔥 DIFFICULTY */}
        <select
          className="w-full p-2 border rounded"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Add Task
        </button>

      </form>
    </div>
  );
}

export default AddTask;