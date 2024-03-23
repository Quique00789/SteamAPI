import React from 'react';

const SteamAchievement = ({ name, achieved, icon }) => {
  return (
    <div>
      <img src={icon} alt={name} />
      <h3>{name}</h3>
      <p>Desbloqueado: {achieved ? 'Sí' : 'No'}</p>
    </div>
  );
};

export default SteamAchievement;