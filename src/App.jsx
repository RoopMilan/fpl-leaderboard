
import React, { useEffect, useState } from 'react';

function App() {
  const [eventId, setEventId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/proxy?url=https://fantasy.premierleague.com/api/bootstrap-static/')
      .then(res => res.json())
      .then(data => {
        const current = data.events.find(e => e.is_current);
        setEventId(current ? current.id : 'Unknown');
      })
      .catch(err => {
        console.error("Failed to load leaderboard data:", err);
        setError("Failed to load data");
      });
  }, []);

  return (
    <div>
      <h1>FPL Leaderboard</h1>
      {error ? <p style={{ color: 'red' }}>{error}</p> : <p>Current Gameweek: {eventId}</p>}
    </div>
  );
}

export default App;
