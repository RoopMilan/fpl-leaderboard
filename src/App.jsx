import React, { useEffect, useState } from "react";

function App() {
  const [eventId, setEventId] = useState(null);
  const [error, setError] = useState(null);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    fetch("/api/proxy?url=https%3A%2F%2Ffantasy.premierleague.com%2Fapi%2Fbootstrap-static%2F")
      .then(res => res.json())
      .then(data => {
        const current = data.events.find(e => e.is_current);
        if (current) setEventId(current.id);
        else setError("No current gameweek found.");
      })
      .catch(err => setError("Failed to load event data."));
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>FPL Leaderboard</h1>
      {error ? <p style={{ color: "red" }}>{error}</p> : <p>Current Gameweek: {eventId}</p>}
    </div>
  );
}

export default App;
