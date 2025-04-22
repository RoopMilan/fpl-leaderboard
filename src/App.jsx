import React, { useEffect, useState } from 'react';

function App() {
  const [players, setPlayers] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [standings, setStandings] = useState([]);
  const [detailed, setDetailed] = useState([]);
  const [error, setError] = useState(null);

  // 1) Load bootstrap-static to get players & current event
  useEffect(() => {
    const fetchBootstrap = async () => {
      try {
        const res = await fetch(
          '/api/proxy?url=' +
            encodeURIComponent('https://fantasy.premierleague.com/api/bootstrap-static/')
        );
        const data = await res.json();
        setPlayers(data.elements);
        setEvents(data.events);
        const current = data.events.find(e => e.is_current);
        if (!current) throw new Error('No current GW found');
        setEventId(current.id);
      } catch (e) {
        console.error(e);
        setError('Failed to load FPL core data.');
      }
    };
    fetchBootstrap();
  }, []);

  // 2) Fetch mini‑league standings for the current GW
  useEffect(() => {
    if (!eventId) return;
    const fetchStandings = async () => {
      try {
        const res = await fetch(
          '/api/proxy?url=' +
            encodeURIComponent(
              `https://fantasy.premierleague.com/api/leagues-classic/363676/standings/`
            )
        );
        const data = await res.json();
        setStandings(data.standings.results);
      } catch (e) {
        console.error(e);
        setError('Failed to load league standings.');
      }
    };
    fetchStandings();
  }, [eventId]);

  // 3) For each entry, fetch their picks for this GW to get chip & captain
  useEffect(() => {
    if (!standings.length || !eventId || !players.length) return;
    const fetchDetails = async () => {
      try {
        const docs = await Promise.all(
          standings.map(async entry => {
            const url =
              '/api/proxy?url=' +
              encodeURIComponent(
                `https://fantasy.premierleague.com/api/entry/${entry.entry}/event/${eventId}/picks/`
              );
            const res = await fetch(url);
            const picksData = await res.json();
            const chip = picksData.active_chip || null;
            const capPick = picksData.picks.find(p => p.is_captain);
            const capPlayer = players.find(pl => pl.id === capPick.element);
            const captainPhoto = capPlayer
              ? `https://resources.premierleague.com/premierleague/photos/players/50x50/p${capPlayer.photo}`
              : null;
            return {
              ...entry,
              chip,
              captainPhoto
            };
          })
        );
        setDetailed(docs);
      } catch (e) {
        console.error(e);
        setError('Failed to load picks details.');
      }
    };
    fetchDetails();
  }, [standings, eventId, players]);

  if (error) {
    return <p style={{ color: 'red', padding: '1rem' }}>{error}</p>;
  }
  if (!eventId || !detailed.length) {
    return <p style={{ padding: '1rem' }}>Loading leaderboard…</p>;
  }

  // Map chip codes to short tags
  const chipTag = chip => {
    switch (chip) {
      case 'wildcard':
        return 'WC';
      case 'freehit':
        return 'FH';
      case 'bboost':
        return 'BB';
      case '3xc':
        return 'TC';
      default:
        return '';
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>FPL Leaderboard</h1>
      <p>Current Gameweek: {eventId}</p>

      <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
        <thead>
          <tr>
            <th>#</th>
            <th>Mgr</th>
            <th>Team</th>
            <th>GW Points</th>
            <th>Chip</th>
            <th>Cap</th>
            <th>Total</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          {detailed.map((row, i) => (
            <tr key={row.entry}>
              <td>{i + 1}</td>
              <td>{row.player_name}</td>
              <td>{row.entry_name}</td>
              <td>{row.event_total}</td>
              <td style={{ textAlign: 'center' }}>{row.chip && chipTag(row.chip)}</td>
              <td style={{ textAlign: 'center' }}>
                {row.captainPhoto && (
                  <img
                    src={row.captainPhoto}
                    alt="C"
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </td>
              <td>{row.total}</td>
              <td>{row.rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
