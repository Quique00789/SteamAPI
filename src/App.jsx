import React, { useState } from 'react';
import SteamProfile from './components/SteamProfile';
import SteamAchievement from './components/SteamAchievement';
import './App.css';

const App = () => {
  const [steamId, setSteamId] = useState('');
  const [appId, setAppId] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [gameName, setGameName] = useState('');
  const [showAllGames, setShowAllGames] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = 'FFEC4AEACAC372C820F7F57EAE503D8D';
  const proxyUrl = 'https://thingproxy.freeboard.io/fetch/';

  const fetchAchievements = async (selectedAppId) => {
    if (!steamId || !selectedAppId) {
      setError('Por favor, selecciona un Steam ID y un juego');
      return;
    }

    try {
      // Primero, obtener los esquemas de logros del juego
      const schemaUrl = `${proxyUrl}https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${apiKey}&appid=${selectedAppId}`;
      const schemaResponse = await fetch(schemaUrl);
      const schemaData = await schemaResponse.json();

      // Luego, obtener los logros del usuario
      const achievementsUrl = `${proxyUrl}https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${apiKey}&steamid=${steamId}&appid=${selectedAppId}`;
      const achievementsResponse = await fetch(achievementsUrl);
      const achievementsData = await achievementsResponse.json();

      if (
        schemaData.game && 
        achievementsData.playerstats && 
        achievementsData.playerstats.achievements
      ) {
        // Mapear logros con sus nombres e iconos reales
        const processedAchievements = achievementsData.playerstats.achievements.map(achievement => {
          // Buscar el logro en el esquema para obtener el nombre y el ícono correcto
          const schemaAchievement = schemaData.game.availableGameStats.achievements.find(
            a => a.name.toLowerCase() === achievement.apiname.toLowerCase()
          );

          return {
            ...achievement,
            displayName: schemaAchievement ? schemaAchievement.displayName : achievement.apiname,
            icon: schemaAchievement ? schemaAchievement.icon : null
          };
        });

        setAchievements(processedAchievements);
        setGameName(schemaData.game.gameName);
        setShowAllGames(false);
        setError(null);
      } else {
        throw new Error('No se encontraron logros para este juego');
      }
    } catch (error) {
      console.error('Error al obtener los logros:', error);
      setError(error.message || 'Error al obtener los logros');
      setAchievements([]);
      setGameName('');
    }
  };

  const handleCloseAchievements = () => {
    setAppId('');
    setAchievements([]);
    setGameName('');
    setShowAllGames(true);
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (steamId && appId) {
      fetchAchievements(appId);
    } else {
      setError('Por favor, introduce el Steam ID y el ID del juego');
    }
  };

  return (
    <div className="container">
      <h1>Steam Profile and Achievements</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Steam ID (64-bit)"
            value={steamId}
            onChange={(e) => setSteamId(e.target.value)}
            required
          />
          
          {!showAllGames && (
            <button 
              type="button" 
              onClick={handleCloseAchievements}
              className="close-btn"
            >
              Cerrar Logros
            </button>
          )}
          
          {showAllGames && (
            <>
              <input
                type="text"
                placeholder="ID del Juego"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                required
              />
              <button type="submit">Buscar Logros</button>
            </>
          )}
        </div>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <SteamProfile 
        steamId={steamId} 
        setAppId={setAppId} 
        fetchAchievements={fetchAchievements} 
        showAllGames={showAllGames} 
      />

      {achievements && achievements.length > 0 && (
        <div className="achievements-section">
          <h2>{gameName}</h2>
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <SteamAchievement
                key={index}
                name={achievement.displayName}
                achieved={achievement.achieved === 1}
                icon={achievement.icon}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;