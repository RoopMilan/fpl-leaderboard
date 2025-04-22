
import React, { useEffect, useState } from "react";

function App() {
  const [league, setLeague] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameweekAndLeague = async () => {
      try {
        // Fetch current gameweek
        const bootstrapRes = await fetch("/api/proxy?url=https://fantasy.premierleague.com/api/bootstrap-static/");
        const bootstrapData = await bootstrapRes.json();
        const currentEvent = bootstrapData.events.find(e => e.is_current);
        if (currentEvent) {
          setEventId(currentEvent.id);
        } else {
          throw new Error("No current gameweek found.");
        }

        // Fetch league standings
        const leagueId = 363676;
        const leagueRes = await fetch(`/api/proxy?url=https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/`);
        const leagueData = await leagueRes.json();
        setLeague(leagueData.standings.results);
      } catch (err) {
        console.error("Failed to load leaderboard data:", err);
        setError("Failed to load leaderboard data. Please try again later.");
      }
    };
    fetchGameweekAndLeague();
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">FPL Leaderboard</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {eventId && <p className="text-center mb-4">Current Gameweek: {eventId}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
            <tr>
              <th className="border px-2 py-1">#</th>
              <th className="border px-2 py-1">Manager</th>
              <th className="border px-2 py-1">Team</th>
              <th className="border px-2 py-1">GW Points</th>
              <th className="border px-2 py-1">Total</th>
              <th className="border px-2 py-1">Rank</th>
            </tr>
          </thead>
          <tbody className="text-sm text-center">
            {league.map((m, idx) => (
              <tr key={m.entry}>
                <td className="border px-2 py-1">{idx + 1}</td>
                <td className="border px-2 py-1">{m.player_name}</td>
                <td className="border px-2 py-1">{m.entry_name}</td>
                <td className="border px-2 py-1">{m.event_total}</td>
                <td className="border px-2 py-1">{m.total}</td>
                <td className="border px-2 py-1">{m.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
