import React from 'react';
import './SteamAchivement.css'; // Ensure that the './SteamAchievement.css' file exists and is accessible in the specified path.
const SteamAchievement = ({ name, achieved, icon }) => {
  return (
    <div>
      <img src={icon} alt={name} />
      <h3>{name}</h3>
    </div>
  );
};

export default SteamAchievement;