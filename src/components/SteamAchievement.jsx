import React from 'react';
import './SteamAchivement.css'; 
const SteamAchievement = ({ name, achieved, icon }) => {
  return (
    <div>
      <img src={icon} alt={name} />
      <h3>{name}</h3>
    </div>
  );
};

export default SteamAchievement;