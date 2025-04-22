import React, { useEffect, useState } from 'react';

function App() {
  const [eventId, setEventId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/proxy?url=https://fantasy.premierleague.com/api/bootstrap-static/');
        const data = await res.json();
        console.log("✅ FPL Bootstrap Data:", data);
  
        setPlayers(data.elements);
        setEvents(data.events);
        const current = data.events.find(e => e.is_current);
        setEventId(current?.id || null);
      } catch (err) {
        console.error("❌ Failed to load FPL data:", err);
      }
    };
  
    fetchData();
  }, []);  

  useEffect(() => {
    console.log("👥 Players:", players);
    console.log("📊 Events:", events);
    console.log("🏆 Leaderboard:", leaderboard);
  }, [players, events, leaderboard]);
  
  return (
    <div>
      <h1>FPL Leaderboard</h1>
      <p>Current Gameweek: {eventId}</p>
    </div>
  );
}

export default App;