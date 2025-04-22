import React, { useEffect, useState } from "react";

function App() {
  const [eventId, setEventId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventId = async () => {
      try {
        const url = encodeURIComponent("https://fantasy.premierleague.com/api/bootstrap-static/");
const response = await fetch(`/api/proxy?url=${url}`);
const data = await response.json();

if (!data?.events || !Array.isArray(data.events)) {
  throw new Error("Invalid API response: events missing");
}
const currentEvent = data.events.find(e => e.is_current);

        if (currentEvent) {
          setEventId(currentEvent.id);
        } else {
          setError("No current event found.");
        }
      } catch (err) {
        console.error("Failed to load bootstrap data:", err);
        setError("Failed to load bootstrap data.");
      }
    };
    fetchEventId();
  }, []);

  return (
    <div>
      <h1>FPL Leaderboard</h1>
      {error ? <p style={color: 'red'}>{error}</p> : <p>Current Gameweek: {eventId}</p>}
    </div>
  );
}

export default App;
