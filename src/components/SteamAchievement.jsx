import React from 'react';
import './SteamAchievement.css'; 

const SteamAchievement = ({ name, achieved, icon }) => {
  return (
    <div className={`achievement ${achieved ? 'achieved' : 'not-achieved'}`}>
      <img 
        src={icon || '/path/to/default/achievement/icon.png'} 
        alt={name} 
        className="achievement-icon"
        onError={(e) => {
          e.target.src = '/path/to/default/achievement/icon.png';
        }}
      />
      <div className="achievement-details">
        <h3>{name}</h3>
        <p>{achieved ? 'Logrado' : 'No completado'}</p>
      </div>
    </div>
  );
};

export default SteamAchievement;