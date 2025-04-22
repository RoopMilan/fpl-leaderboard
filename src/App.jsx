
import React, { useEffect, useState } from "react";

function App() {
  const [error, setError] = useState(null);
  const [eventId, setEventId] = useState(null);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setEventId(34);
      // setError("Something went wrong!"); // Uncomment to test error state
    }, 1000);
  }, []);

  return (
    <div>
      <h1>FPL Leaderboard</h1>
      {error ? <p style={{ color: 'red' }}>{error}</p> : <p>Current Gameweek: {eventId}</p>}
    </div>
  );
}

export default App;
