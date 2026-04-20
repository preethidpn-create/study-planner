import { useEffect, useState } from "react";
import API from "../api";

function Tasks() {
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/1");
      const all = res.data;

      setPending(all.filter((t) => !t.is_completed));
      setCompleted(all.filter((t) => t.is_completed));
    } catch (error) {
      console.log(error);
    }
  };

  const markComplete = async (id) => {
    try {
      await API.put(`/tasks/${id}/complete`);
      setMessage("✅ Task completed!");
      fetchTasks();
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setMessage("🗑 Task deleted!");
      fetchTasks();
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📋 Tasks</h1>

      {/* MESSAGE */}
      {message && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}

      {/* 🟡 PENDING TASKS */}
      <h2 className="text-xl font-semibold mb-3 text-yellow-600">
        🟡 Pending Tasks
      </h2>

      {pending.length === 0 ? (
        <p className="text-gray-500">No pending tasks</p>
      ) : (
        pending.map((task) => (
          <div
            key={task.id}
            className="bg-white p-4 mb-3 rounded-xl shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>

            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-500">
                📅 {task.due_date}
              </span>

              <div className="flex gap-2">
                {/* COMPLETE BUTTON */}
                <button
                  onClick={() => markComplete(task.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  ✔ Done
                </button>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* 🟢 COMPLETED TASKS */}
      <h2 className="text-xl font-semibold mt-8 mb-3 text-green-600">
        🟢 Completed Tasks
      </h2>

      {completed.length === 0 ? (
        <p className="text-gray-500">No completed tasks</p>
      ) : (
        completed.map((task) => (
          <div
            key={task.id}
            className="bg-gray-100 p-4 mb-3 rounded-xl"
          >
            <h3 className="line-through text-gray-500">
              {task.title}
            </h3>
            <p className="text-gray-500">{task.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Tasks;