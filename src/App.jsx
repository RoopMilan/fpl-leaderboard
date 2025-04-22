import React, { useEffect, useState } from 'react';

function App() {
  const [eventId, setEventId] = useState(null);

  useEffect(() => {
    fetch('/api/proxy?url=https%3A%2F%2Ffantasy.premierleague.com%2Fapi%2Fbootstrap-static%2F')
      .then(res => res.json())
      .then(data => {
        const current = data?.events?.find(e => e.is_current);
        if (current) {
          setEventId(current.id);
        }
      })
      .catch(() => {
        setEventId('Error loading data');
      });
  }, []);

  return (
    <div>
      <h1>FPL Leaderboard</h1>
      <p>Current Gameweek: {eventId}</p>
    </div>
  );
}

export default App;