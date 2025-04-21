import React, { useEffect, useState } from "react";

const leagueId = 363676;
const entryIds = [1558, 770531, 1949017, 21753, 3878863, 4764008];

function App() {
  const [managers, setManagers] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [loading, setLoading] = useState(true);
  const proxy = "/api/proxy?url=";

  const fetchJson = async (url) => {
    const encodedUrl = encodeURIComponent(url);
    const res = await fetch(`${proxy}${encodedUrl}`);
    if (!res.ok) throw new Error(`Fetch failed for ${url}`);
    return res.json();
  };

  useEffect(() => {
    const fetchEventId = async () => {
      try {
        const data = await fetchJson("https://fantasy.premierleague.com/api/bootstrap-static/");
        const current = data.events.find((e) => e.is_current);
        if (current) {
          setEventId(current.id);
        } else {
          console.warn("No current gameweek found");
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load bootstrap data:", err);
        setLoading(false);
      }
    };
    fetchEventId();
  }, []);

  useEffect(() => {
    if (!eventId) return;

    const fetchLeagueData = async () => {
      try {
        const leagueData = await fetchJson(`https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/`);
        const allEntries = leagueData.standings.results.filter(m =>
          entryIds.includes(m.entry)
        );

        const detailed = await Promise.all(
          allEntries.map(async (entry) => {
            const picksData = await fetchJson(`https://fantasy.premierleague.com/api/entry/${entry.entry}/event/${eventId}/picks/`);
            const teamData = await fetchJson(`https://fantasy.premierleague.com/api/entry/${entry.entry}/`);

            const gwPoints = picksData.entry_history.points - picksData.entry_history.event_transfers_cost;

            return {
              name: entry.player_name,
              team: entry.entry_name,
              rank: entry.rank,
              total: entry.total,
              gw_points: gwPoints,
              overall_rank: teamData.summary_overall_rank,
              team_value: teamData.last_deadline_value / 10,
              bank: teamData.last_deadline_bank / 10
            };
          })
        );

        setManagers(detailed);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load leaderboard data:", err);
        setLoading(false);
      }
    };

    fetchLeagueData();
  }, [eventId]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">FPL Leaderboard</h1>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : managers.length === 0 ? (
        <div className="text-center text-red-500">Failed to load data. Please try again later.</div>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">#</th>
              <th className="p-2">Manager</th>
              <th className="p-2">Team</th>
              <th className="p-2">GW Points</th>
              <th className="p-2">Total</th>
              <th className="p-2">Rank</th>
              <th className="p-2">Team Value</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((m, i) => (
              <tr key={i} className="border-t text-sm">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{m.name}</td>
                <td className="p-2">{m.team}</td>
                <td className="p-2">{m.gw_points}</td>
                <td className="p-2">{m.total}</td>
                <td className="p-2">#{m.overall_rank}</td>
                <td className="p-2">{m.team_value}M</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
