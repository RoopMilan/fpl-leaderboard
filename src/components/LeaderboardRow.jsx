import React from 'react';
import { getChipIcon, getCaptainImageUrl } from "../utils/LeaderboardUtils";

const LeaderboardRow = ({ manager }) => {
  const { name, totalPoints, chip, captainId, weeklyWins } = manager;

  return (
    <tr>
      <td>{name}</td>
      <td>{totalPoints}</td>
      <td>{chip ? getChipIcon(chip) : '-'}</td>
      <td>
        {captainId ? (
          <img
            src={getCaptainImageUrl(captainId)}
            alt="Captain"
            className="captain-avatar"
          />
        ) : (
          '-'
        )}
      </td>
      <td>{weeklyWins}</td>
    </tr>
  );
};

export default LeaderboardRow;