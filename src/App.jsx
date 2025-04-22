
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "./components/ui/dialog";

const TEAM_IDS = [1558, 770531, 1949017, 21753, 3878863, 4764008];

function App() {
  const [bootstrap, setBootstrap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const encodedUrl = encodeURIComponent("https://fantasy.premierleague.com/api/bootstrap-static/");
        const res = await fetch(`/api/proxy?url=${encodedUrl}`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setBootstrap(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load bootstrap data:", err);
        setError("Failed to load event data. Please try again later.");
      }
    };
    fetchData();
  }, []);

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
            <th>GW Points</th>
            <th>Total</th>
            <th>Rank</th>
            <th>Team Value</th>
          </tr>
        </thead>
        <tbody>
          {TEAM_IDS.map((id, index) => (
            <tr key={id}>
              <td>{index + 1}</td>
              <td>Manager {id}</td>
              <td>Team {id}</td>
              <td>{Math.floor(Math.random() * 70) + 20}</td>
              <td>{Math.floor(Math.random() * 2200) + 1500}</td>
              <td>#{Math.floor(Math.random() * 100000)}</td>
              <td>{(Math.random() * 5 + 100).toFixed(1)}M</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
