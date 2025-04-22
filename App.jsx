
import React, { useEffect, useState } from "react";

function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBootstrap = async () => {
      try {
        const res = await fetch("/api/proxy?url=https%3A%2F%2Ffantasy.premierleague.com%2Fapi%2Fbootstrap-static%2F");
        if (!res.ok) throw new Error("Failed to fetch bootstrap data");
        const data = await res.json();
        const currentEvent = data.events.find((e) => e.is_current);
        setEventId(currentEvent?.id || null);
      } catch (err) {
        console.error("Failed to load bootstrap data:", err);
        setError("Could not fetch gameweek data.");
      }
    };

    fetchBootstrap();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>FPL Leaderboard</h1>
      {error ? <p style={{ color: "red" }}>{error}</p> : <p>Current Gameweek: {eventId}</p>}
    </div>
  );
}

export default App;
