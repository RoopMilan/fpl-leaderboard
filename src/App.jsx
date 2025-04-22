import React, { useEffect, useState } from 'react';

function App() {
  const [league, setLeague] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch gameweek info
        const eventRes = await fetch(
          '/api/proxy?url=' +
            encodeURIComponent('https://fantasy.premierleague.com/api/bootstrap-static/')
        );
        const eventData = await eventRes.json();
        const currentEvent = eventData.events.find((e) => e.is_current);
        setEventId(currentEvent?.id);

        // Fetch league standings
        const leagueRes = await fetch(
          '/api/proxy?url=' +
            encodeURIComponent('https://fantasy.premierleague.com/api/leagues-classic/363676/standings/')
        );
        const leagueData = await leagueRes.json();
        setLeague(leagueData.standings.results);
      } catch (err) {
        console.error('Failed to load leaderboard data:', err);
        setError('Failed to load data.');
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>FPL Leaderboard</h1>
      {eventId && <p>Current Gameweek: {eventId}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
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
      )}
    </div>
  );
}

export default App;
