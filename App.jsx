
import React, { useEffect, useState } from "react";

const App = () => {
  const [eventId, setEventId] = useState(null);
  const [standings, setStandings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameweek = async () => {
      try {
        const res = await fetch("/api/proxy?url=https%3A%2F%2Ffantasy.premierleague.com%2Fapi%2Fbootstrap-static%2F");
        const data = await res.json();
        const currentGW = data.events.find(e => e.is_current);
        setEventId(currentGW?.id || "N/A");
      } catch (err) {
        console.error("Failed to fetch gameweek data", err);
        setError("Failed to fetch gameweek");
      }
    };

    const fetchLeagueData = async () => {
      try {
        const res = await fetch("/api/proxy?url=https%3A%2F%2Ffantasy.premierleague.com%2Fapi%2Fleagues-classic%2F314%2Fstandings%2F");
        const data = await res.json();
        setStandings(data.standings.results || []);
      } catch (err) {
        console.error("Failed to fetch league data", err);
        setError("Failed to fetch leaderboard");
      }
    };

    fetchGameweek();
    fetchLeagueData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>FPL Leaderboard</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p>Current Gameweek: {eventId}</p>
      )}

      {standings.length > 0 ? (
        <table border="1" cellPadding="10" style={{ marginTop: "1rem", borderCollapse: "collapse" }}>
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
            {standings.map((m, i) => (
              <tr key={m.entry}>
                <td>{i + 1}</td>
                <td>{m.player_name}</td>
                <td>{m.entry_name}</td>
                <td>{m.event_total}</td>
                <td>{m.total}</td>
                <td>{m.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ marginTop: "2rem" }}>Loading leaderboard...</p>
      )}
    </div>
  );
};

export default App;
