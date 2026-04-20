import { useEffect, useState } from "react";
import API from "../api";

function AI() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchAI();
  }, []);

  const fetchAI = async () => {
    try {
      const res = await API.get("/ai-suggestions/1");
      setSuggestions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>🤖 AI Smart Suggestions</h2>

      {suggestions.length === 0 ? (
        <p>No suggestions available</p>
      ) : (
        suggestions.map((s, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "10px",
              background: "#eef6ff"
            }}
          >
            {s}
          </div>
        ))
      )}
    </div>
  );
}

export default AI;