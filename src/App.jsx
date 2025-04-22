
import React, { useEffect, useState } from 'react';

function App() {
  const [league, setLeague] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventRes = await fetch('/api/proxy?url=https%3A%2F%2Ffantasy.premierleague.com%2Fapi%2Fbootstrap-static%2F');
        const eventData = await eventRes.json();
        const currentEvent = eventData.events.find(e => e.is_current);
        setEventId(currentEvent.id);

        const leagueRes = await fetch('/api/proxy?url=https%3A%2F%2Ffantasy.premierleague.com%2Fapi%2Fleagues-classic%2F363676%2Fstandings%2F');
        const leagueData = await leagueRes.json();
        setLeague(leagueData.standings.results);
      } catch (err) {
        console.error('Failed to load leaderboard data:', err);
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">FPL Leaderboard</h1>
      <p className="mb-4">Current Gameweek: {eventId}</p>
      {error && <p className="text-red-500">{error}</p>}
      <table className="table-auto w-full border-collapse border border-gray-300">
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
          {league.map((entry, idx) => (
            <tr key={entry.entry}>
              <td>{idx + 1}</td>
              <td>{entry.player_name}</td>
              <td>{entry.entry_name}</td>
              <td>{entry.event_total}</td>
              <td>{entry.total}</td>
              <td>{entry.rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
