import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "./components/ui/dialog.jsx";

function App() {
  const [eventId, setEventId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBootstrap = async () => {
      try {
        const res = await fetch(
          "/api/proxy?url=" +
            encodeURIComponent("https://fantasy.premierleague.com/api/bootstrap-static/")
        );
        const data = await res.json();
        if (!Array.isArray(data.events)) throw new Error("Events missing");
        const current = data.events.find((e) => e.is_current);
        if (current) setEventId(current.id);
        else throw new Error("No current gameweek found");
      } catch (e) {
        console.error("Failed to load bootstrap data:", e);
        setError("Failed to load event data. Please try again later.");
      }
    };
    fetchBootstrap();
  }, []);

  return (
    <div className="p-4">
      <h1>FPL Leaderboard</h1>
      {error ? <p style={{ color: "red" }}>{error}</p> : <p>Current Gameweek: {eventId}</p>}
    </div>
  );
}

export default App;