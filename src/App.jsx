import React, { useEffect, useState } from 'react';

function App() {
  const [eventId, setEventId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/proxy?url=' + encodeURIComponent('https://fantasy.premierleague.com/api/bootstrap-static/'));
        const data = await response.json();
        const current = data.events.find(e => e.is_current);
        setEventId(current?.id ?? 'Unavailable');
      } catch (err) {
        console.error('Failed to load bootstrap data:', err);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>FPL Leaderboard</h1>
      <p>Current Gameweek: {eventId}</p>
    </div>
  );
}

export default App;