
// Minimal working version
import React, { useEffect, useState } from "react";

export default function App() {
  const [eventId, setEventId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBootstrapData = async () => {
      try {
        const res = await fetch(`/api/proxy?url=${encodeURIComponent("https://fantasy.premierleague.com/api/bootstrap-static/")}`);
        const data = await res.json();
        const current = data.events.find(e => e.is_current);
        setEventId(current?.id || "N/A");
      } catch (err) {
        setError("Failed to load leaderboard data");
        console.error("Failed to load bootstrap data:", err);
      }
    };
    fetchBootstrapData();
  }, []);

  return (
    <div>
      <h1>FPL Leaderboard</h1>
      {error ? <p style={{ color: 'red' }}>{error}</p> : <p>Current Gameweek: {eventId}</p>}
    </div>
  );
}
