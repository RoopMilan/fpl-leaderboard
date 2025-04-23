import React, { useEffect, useState } from "react";

function App() {
  const [eventId, setEventId] = useState(null);
  const [leagueData, setLeagueData] = useState([]);
  const [error, setError] = useState(null);

  const miniLeagueId = 363676; // Replace with your real league ID
  const removedNames = ["Ashique Chowdhury", "Rifat Shahriar", "Ahmed Tazeem"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bootstrap = await fetch("/api/proxy?url=https%3A%2F%2Ffantasy.premierleague.com%2Fapi%2Fbootstrap-static%2F");
        const bootstrapData = await bootstrap.json();
        const currentEvent = bootstrapData.events.find(e => e.is_current);
        if (currentEvent) {
          setEventId(currentEvent.id);
        }

        const leagueRes = await fetch(`/api/proxy?url=https%3A%2F%2Ffantasy.premierleague.com%2Fapi%2Fleagues-classic%2F${miniLeagueId}%2Fstandings`);
        const league = await leagueRes.json();
        const cleanData = league.standings.results.filter(m => !removedNames.includes(m.player_name));
        setLeagueData(cleanData);
      } catch (err) {
        console.error("Fetch failed:", err);
        setError("Failed to load leaderboard data.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">FPL Leaderboard</h1>
      <p className="mb-6 text-muted-foreground">Current Gameweek: {eventId ?? "Loading..."}</p>
      {error && <p className="text-red-500">{error}</p>}
      <table className="table-auto w-full border-collapse border border-gray-300 text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">#</th>
            <th className="border px-2 py-1">Manager</th>
            <th className="border px-2 py-1">Team</th>
            <th className="border px-2 py-1">GW Points</th>
            <th className="border px-2 py-1">Total</th>
            <th className="border px-2 py-1">Rank</th>
          </tr>
        </thead>
        <tbody>
          {leagueData.map((m, idx) => (
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
  );
}

export default App;
