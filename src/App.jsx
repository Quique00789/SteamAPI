import React, { useState, useEffect } from 'react';
import SteamAchievement from './components/SteamAchievement';
import './App.css';
const App = () => {
  const [steamId, setSteamId] = useState('');
  const [appId, setAppId] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [gameName, setGameName] = useState('');

  const fetchAchievements = async () => {
    const apiKey = 'FFEC4AEACAC372C820F7F57EAE503D8D';
    const proxyUrl = 'https://thingproxy.freeboard.io/fetch/';
    const apiUrl = `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${appId}&key=${apiKey}&steamid=${steamId}`;
    const url = `${proxyUrl}${encodeURIComponent(apiUrl)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.playerstats) {
        setAchievements(data.playerstats.achievements);
        setGameName(data.playerstats.gameName);
      } else {
        console.error('Error al obtener los logros de Steam.');
      }
    } catch (error) {
      console.error('Error al hacer la solicitud a la API de Steam:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAchievements();
  };

  return (
    <div>
      <h1>Logros de Steam</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ID de Steam"
          value={steamId}
          onChange={(e) => setSteamId(e.target.value)}
        />
        <input
          type="text"
          placeholder="ID del juego"
          value={appId}
          onChange={(e) => setAppId(e.target.value)}
        />
        <button type="submit">Obtener logros</button>
      </form>
      <h2>{gameName}</h2>
      {achievements.map((achievement, index) => (
        <SteamAchievement
          key={index}
          name={achievement.name}
          achieved={achievement.achieved === 1}
          icon={`https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/${appId}/${achievement.name}.png`}
        />
      ))}
    </div>
  );
};

export default App;