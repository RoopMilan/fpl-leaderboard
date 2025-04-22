import React, { useEffect, useState } from "react";

function App() {
  const [eventId, setEventId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBootstrap = async () => {
      try {
        const res = await fetch("/api/proxy?url=" + encodeURIComponent("https://fantasy.premierleague.com/api/bootstrap-static/"));
        const data = await res.json();
        const current = data.events.find(e => e.is_current);
        setEventId(current?.id);
      } catch (err) {
        console.error("Failed to load bootstrap data:", err);
        setError("Failed to load leaderboard data");
      }
    };
    fetchBootstrap();
  }, []);

  return (
    <div>
      <h1>FPL Leaderboard</h1>
      {error ? <p style={{ color: "red" }}>{error}</p> : <p>Current Gameweek: {eventId}</p>}
    </div>
  );
}

export default App;