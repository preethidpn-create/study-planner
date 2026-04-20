import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [smartPlan, setSmartPlan] = useState([]);

  const [tab, setTab] = useState("smart");

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      navigate("/");
      return;
    }

    setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user]);

  const load = async () => {
    try {
      const id = user?.id;

      const [t, p, c, s] = await Promise.all([
        API.get(`/tasks/${id}`),
        API.get(`/tasks/pending/${id}`),
        API.get(`/tasks/completed/${id}`),
        API.get(`/smart-plan/${id}`)
      ]);

      setTasks(t.data || []);
      setPending(p.data || []);
      setCompleted(c.data || []);
      setSmartPlan(s.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const completeTask = async (id) => {
    await API.put(`/tasks/${id}/complete`);
    load();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    load();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // 🧠 AI suggestion logic
  const getAISuggestion = (task) => {
    const today = new Date();
    const due = new Date(task.due_date);

    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diff <= 1) return "⚡ Do this today (urgent)";
    if (task.priority === "high") return "🔥 High priority task";
    if (task.difficulty === "hard") return "🧠 Needs focus time";

    return "🙂 Can be done later";
  };

  const Card = ({ t, actions, done }) => (
    <div style={styles.card}>
      <div style={styles.title}>{t.title}</div>

      <div style={styles.desc}>{t.description}</div>

      {done && <div style={styles.done}>Completed 🎉</div>}

      {actions && (
        <div style={styles.actions}>
          <button onClick={() => completeTask(t.id)} style={styles.doneBtn}>
            ✔
          </button>
          <button onClick={() => deleteTask(t.id)} style={styles.delBtn}>
            🗑
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h2>👋 {user?.username}</h2>

        <div>
          <button onClick={() => navigate("/add")} style={styles.addBtn}>
            + Add Task
          </button>

          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        <button onClick={() => setTab("smart")} style={tab === "smart" ? styles.activeTab : styles.tab}>Smart</button>
        <button onClick={() => setTab("pending")} style={tab === "pending" ? styles.activeTab : styles.tab}>Pending</button>
        <button onClick={() => setTab("completed")} style={tab === "completed" ? styles.activeTab : styles.tab}>Done</button>
        <button onClick={() => setTab("all")} style={tab === "all" ? styles.activeTab : styles.tab}>All</button>
      </div>

      {/* CONTENT */}

      {/* SMART TAB WITH AI */}
      {tab === "smart" && (
        <div style={styles.grid}>
          {smartPlan.map((t) => (
            <div key={t.id} style={styles.card}>
              <div style={styles.title}>{t.title}</div>
              <div style={styles.desc}>{t.description}</div>

              <div style={styles.ai}>
                {getAISuggestion(t)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PENDING */}
      {tab === "pending" && (
        <div style={styles.grid}>
          {pending.map((t) => (
            <Card key={t.id} t={t} actions />
          ))}
        </div>
      )}

      {/* COMPLETED */}
      {tab === "completed" && (
        <div style={styles.grid}>
          {completed.map((t) => (
            <Card key={t.id} t={t} done />
          ))}
        </div>
      )}

      {/* ALL TASKS */}
      {tab === "all" && (
        <div style={styles.grid}>
          {tasks.map((t) => (
            <Card key={t.id} t={t} actions />
          ))}
        </div>
      )}

    </div>
  );
}

const styles = {
  page: {
    maxWidth: "850px",
    margin: "auto",
    padding: "20px",
    fontFamily: "Arial",
    background: "#f6f7fb",
    minHeight: "100vh"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  tabs: {
    display: "flex",
    gap: "10px",
    marginTop: "15px"
  },

  tab: {
    padding: "6px 12px",
    border: "none",
    background: "#ddd",
    borderRadius: "6px",
    cursor: "pointer"
  },

  activeTab: {
    padding: "6px 12px",
    border: "none",
    background: "#4f46e5",
    color: "white",
    borderRadius: "6px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
    marginTop: "20px"
  },

  card: {
    background: "white",
    padding: "12px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
  },

  title: {
    fontWeight: "bold"
  },

  desc: {
    fontSize: "12px",
    color: "#555",
    marginTop: "5px"
  },

  ai: {
    marginTop: "8px",
    fontSize: "12px",
    color: "#4f46e5"
  },

  done: {
    fontSize: "12px",
    color: "green",
    marginTop: "5px"
  },

  actions: {
    marginTop: "10px",
    display: "flex",
    gap: "8px"
  },

  doneBtn: {
    background: "green",
    color: "white",
    border: "none",
    padding: "4px 8px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  delBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "4px 8px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  addBtn: {
    marginRight: "8px",
    padding: "6px 10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px"
  },

  logoutBtn: {
    padding: "6px 10px",
    background: "black",
    color: "white",
    border: "none",
    borderRadius: "6px"
  }
};

export default Dashboard;