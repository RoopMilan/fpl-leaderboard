import React, { useEffect, useState } from "react";
import "./App.css";

const TEAM_IDS = [1558, 770531, 1949017, 21753, 3878863, 4764008];
const CURRENT_GW = 34;

function App() {
  const [data, setData] = useState([]);
  const [bootstrap, setBootstrap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProxy = async (url) => {
    const encoded = encodeURIComponent(url);
    const res = await fetch(`/api/proxy?url=${encoded}`);
    if (!res.ok) throw new Error("Fetch failed for " + url);
    return res.json();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const boot = await fetchProxy("https://fantasy.premierleague.com/api/bootstrap-static/");
        setBootstrap(boot);
        const playerMap = {};
        boot.elements.forEach(p => playerMap[p.id] = p);
        const allData = await Promise.all(TEAM_IDS.map(async (id) => {
          const entry = await fetchProxy(`https://fantasy.premierleague.com/api/entry/${id}/`);
          const event = await fetchProxy(`https://fantasy.premierleague.com/api/entry/${id}/event/${CURRENT_GW}/picks/`);
          const history = await fetchProxy(`https://fantasy.premierleague.com/api/entry/${id}/history/`);
          const thisWeek = history.current.find(gw => gw.event === CURRENT_GW);
          const captain = playerMap[event.picks.find(p => p.is_captain)?.element];
          const chip = event.active_chip || "";
          return {
            id,
            name: entry.player_first_name + " " + entry.player_last_name,
            team: entry.name,
            total: entry.summary_overall_points,
            rank: entry.summary_overall_rank,
            teamValue: ((entry.last_deadline_value || 1000) / 10).toFixed(1),
            gwPoints: thisWeek.points - thisWeek.event_transfers_cost,
            chip: chip.toUpperCase().replace("_", ""),
            avatar: captain?.photo,
          };
        }));
        setData(allData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load leaderboard data:", err);
        setError("Failed to load event data. Please try again later.");
      }
    };
    fetchData();
  }, []);

  const getChipColor = (chip) => {
    if (chip === "FH") return "#38bdf8";
    if (chip === "WC") return "#facc15";
    if (chip === "BB") return "#4ade80";
    if (chip === "TC") return "#f87171";
    return "#ccc";
  };

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading FPL Leaderboard...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red", textAlign: "center" }}>{error}</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>FPL Leaderboard</h1>
      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
        <thead style={{ background: "#eee" }}>
          <tr>
            <th>#</th>
            <th>Manager</th>
            <th>Team</th>
            <th>Captain</th>
            <th>GW Points</th>
            <th>Total</th>
            <th>Rank</th>
            <th>Team Value</th>
            <th>Chip</th>
          </tr>
        </thead>
        <tbody>
          {data.map((t, index) => (
            <tr key={t.id}>
              <td>{index + 1}</td>
              <td>{t.name}</td>
              <td>{t.team}</td>
              <td>
                <img
                  src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${t.avatar?.replace(".jpg", "")}.png`}
                  alt="Captain"
                  style={{ width: "35px", height: "45px", objectFit: "contain" }}
                />
              </td>
              <td>{t.gwPoints}</td>
              <td>{t.total}</td>
              <td>#{t.rank}</td>
              <td>{t.teamValue}M</td>
              <td style={{ background: getChipColor(t.chip), color: "#000", fontWeight: "bold" }}>{t.chip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;