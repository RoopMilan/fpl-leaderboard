import React, { useEffect, useState } from "react";

function App() {
  const [eventId, setEventId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBootstrapData = async () => {
      try {
        const proxyUrl = "/api/proxy?url=" + encodeURIComponent("https://fantasy.premierleague.com/api/bootstrap-static/");
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const currentEvent = data.events.find(e => e.is_current);
        setEventId(currentEvent?.id || "N/A");
      } catch (err) {
        console.error("Failed to load leaderboard data:", err);
        setError("Failed to load leaderboard data");
      }
    };

    fetchBootstrapData();
  }, []);

  return (
    <div>
      <h1>FPL Leaderboard</h1>
      {error ? <p style={{ color: "red" }}>{error}</p> : <p>Current Gameweek: {eventId}</p>}
    </div>
  );
}

export default App;
