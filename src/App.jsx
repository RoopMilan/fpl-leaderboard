import React, { useEffect, useState } from "react";

function App() {
  const [eventId, setEventId] = useState(null);
  const [error, setError] = useState(null);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    const leagueId = 363676; // Your mini-league ID
    const fetchLeagueData = async () => {
      try {
        const bootstrapRes = await fetch("/api/proxy?url=" + encodeURIComponent("https://fantasy.premierleague.com/api/bootstrap-static/"));
        const bootstrapData = await bootstrapRes.json();
        const currentEvent = bootstrapData.events.find(e => e.is_current);
        setEventId(currentEvent?.id || null);

        const leagueRes = await fetch(`/api/proxy?url=${encodeURIComponent(`https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/`)}`);
        const leagueData = await leagueRes.json();

        setManagers(leagueData.standings.results);
      } catch (err) {
        console.error("Failed to load leaderboard data:", err);
        setError("Failed to load leaderboard data. Please try again later.");
      }
    };

    fetchLeagueData();
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">FPL Leaderboard</h1>
      {eventId && <p className="text-center text-muted-foreground mb-4">Current Gameweek: {eventId}</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {managers.length > 0 && (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-2 py-1">#</th>
              <th className="border border-gray-300 px-2 py-1">Manager</th>
              <th className="border border-gray-300 px-2 py-1">Team</th>
              <th className="border border-gray-300 px-2 py-1">GW Points</th>
              <th className="border border-gray-300 px-2 py-1">Total</th>
              <th className="border border-gray-300 px-2 py-1">Rank</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager, index) => (
              <tr key={manager.entry} className="text-center">
                <td className="border border-gray-300 px-2 py-1">{index + 1}</td>
                <td className="border border-gray-300 px-2 py-1">{manager.player_name}</td>
                <td className="border border-gray-300 px-2 py-1">{manager.entry_name}</td>
                <td className="border border-gray-300 px-2 py-1">{manager.event_total}</td>
                <td className="border border-gray-300 px-2 py-1">{manager.total}</td>
                <td className="border border-gray-300 px-2 py-1">{manager.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;