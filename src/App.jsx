import React, { useEffect, useState } from "react";

function App() {
  const [eventId, setEventId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const proxyUrl = "/api/proxy?url=";
        const targetUrl = encodeURIComponent("https://fantasy.premierleague.com/api/bootstrap-static/");
        const response = await fetch(`${proxyUrl}${targetUrl}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const current = data.events.find((e) => e.is_current);
        if (current) {
          setEventId(current.id);
        } else {
          setError("No current gameweek found.");
        }
      } catch (err) {
        console.error("Failed to load bootstrap data:", err);
        setError("Failed to load event data. Please check your connection or try again later.");
      }
    };
    fetchEvents();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>FPL Leaderboard</h1>
      {error ? <p style={{ color: "red" }}>{error}</p> : <p>Current Gameweek: {eventId}</p>}
    </div>
  );
}

export default App;