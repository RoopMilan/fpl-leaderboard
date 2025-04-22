import React, { useEffect, useState } from "react";

function App() {
  const [players, setPlayers] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/proxy?url=" + encodeURIComponent("https://fantasy.premierleague.com/api/bootstrap-static/"));
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        console.log("✅ Bootstrap data:", data);
        setPlayers(data.elements);
        const current = data.events.find(e => e.is_current);
        setEventId(current?.id || null);
        // Simulated leaderboard data logic
        setLeaderboard([
          { name: "Manager One", team: "Team One", gwPoints: 56, total: 2200, rank: 1 },
          { name: "Manager Two", team: "Team Two", gwPoints: 48, total: 2185, rank: 2 }
        ]);
      } catch (err) {
        console.error("❌ Error loading data", err);
        setError("Failed to load data");
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>FPL Leaderboard</h1>
      {eventId && <p>Current Gameweek: {eventId}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {leaderboard.length > 0 && (
        <table border="1" cellPadding="8" style={{ marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Manager</th>
              <th>Team</th>
              <th>GW Points</th>
              <th>Total</th>
              <th>Rank</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.team}</td>
                <td>{entry.gwPoints}</td>
                <td>{entry.total}</td>
                <td>{entry.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;