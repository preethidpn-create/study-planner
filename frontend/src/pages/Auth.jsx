import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await API.post("/login", {
          email,
          password,
        });

        console.log("LOGIN SUCCESS:", res.data);

        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.access_token);

        navigate("/dashboard");
      } else {
        await API.post("/register", {
          username,
          email,
          password,
        });

        alert("Registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      console.log("AUTH ERROR:", err);
      alert(err.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <h2 style={styles.title}>
          {isLogin ? "Welcome Back 👋" : "Create Account ✨"}
        </h2>

        <p style={styles.subtitle}>
          {isLogin ? "Login to continue" : "Register to get started"}
        </p>

        {!isLogin && (
          <input
            style={styles.input}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSubmit} style={styles.button}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p style={styles.toggleText}>
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={styles.link}
          >
            {isLogin ? "Create account" : "Login"}
          </span>
        </p>

      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)"
  },

  card: {
    width: "320px",
    padding: "25px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "center"
  },

  title: {
    marginBottom: "5px"
  },

  subtitle: {
    fontSize: "12px",
    color: "#666",
    marginBottom: "20px"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    outline: "none"
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "5px"
  },

  toggleText: {
    fontSize: "12px",
    marginTop: "15px",
    color: "#666"
  },

  link: {
    color: "#4f46e5",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

export default Auth;