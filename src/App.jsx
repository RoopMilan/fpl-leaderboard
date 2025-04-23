import React, { useEffect, useState } from "react";
import LeaderboardRow from "./components/LeaderboardRow";
import LeaderboardHeader from "./components/LeaderboardHeader";
import "./styles/App.css";
import { getChipIcon, getCaptainImageUrl } from "./utils/LeaderboardUtils";

function App() {
  const [eventId, setEventId] = useState(null);
  const [leagueData, setLeagueData] = useState([]);
  const [elementsData, setElementsData] = useState([]);
  const [weeklyWinners, setWeeklyWinners] = useState({});
  const [error, setError] = useState(null);

  const miniLeagueId = 363676;
  const removedNames = ["Ashique Chowdhury", "Rifat Shahriar", "Ahmed Tazeem"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bootstrap = await fetch("/api/proxy?url=https%3A%2F%2Ffantasy.premierleague.com%2Fapi%2Fbootstrap-static%2F");
        const bootstrapData = await bootstrap.json();
        setElementsData(bootstrapData.elements);

        const currentEvent = bootstrapData.events.find(e => e.is_current);
        if (currentEvent) {
          setEventId(currentEvent.id);
        }

        const leagueRes = await fetch(`/api/proxy?url=https%3A%2F%2Ffantasy.premierleague.com%2Fapi%2Fleagues-classic%2F${miniLeagueId}%2Fstandings`);
        const league = await leagueRes.json();
        const cleanData = league.standings.results.filter(m => !removedNames.includes(m.player_name));
        setLeagueData(cleanData);

        const highest = Math.max(...cleanData.map(m => m.event_total));
        const wins = {};
        cleanData.forEach(m => {
          if (m.event_total === highest) {
            wins[m.entry] = true;
          }
        });
        setWeeklyWinners(wins);
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
        <LeaderboardHeader />
        <tbody>
          {leagueData.map((m, idx) => (
            <LeaderboardRow
              key={m.entry}
              manager={{
                id: m.entry,
                name: m.player_name,
                totalPoints: m.total,
                chip: m.active_chip,
                captainId: m.captain,
                weeklyWins: weeklyWinners[m.entry] ? 1 : 0
              }}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
