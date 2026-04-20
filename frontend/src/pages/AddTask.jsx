import { useState } from "react";
import API from "../api";

function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [difficulty, setDifficulty] = useState("easy");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/tasks", {
      title,
      description,
      due_date: dueDate,
      difficulty,
      subject_id: 1,
    });

    alert("Task Added ✅");

    setTitle("");
    setDescription("");
    setDueDate("");
    setDifficulty("easy");
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
        />

        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="date"
          className="w-full p-2 border rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        {/* 🔥 NEW FIELD */}
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