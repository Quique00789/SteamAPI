import React, { useState, useEffect } from 'react';

const SteamProfile = ({ steamId, setAppId, fetchAchievements, showAllGames }) => {
  const [playerSummary, setPlayerSummary] = useState(null);
  const [ownedGames, setOwnedGames] = useState([]);
  const [recentlyPlayedGames, setRecentlyPlayedGames] = useState([]);

  useEffect(() => {
    const fetchPlayerData = async () => {
      const apiKey = 'FFEC4AEACAC372C820F7F57EAE503D8D';
      const proxyUrl = 'https://thingproxy.freeboard.io/fetch/';

      try {
        // Fetch player summary
        const playerSummaryUrl = `${proxyUrl}https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`;
        const playerSummaryResponse = await fetch(playerSummaryUrl);
        const playerSummaryData = await playerSummaryResponse.json();
        setPlayerSummary(playerSummaryData.response.players[0]);

        // Fetch owned games
        const ownedGamesUrl = `${proxyUrl}https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=1&format=json`;
        const ownedGamesResponse = await fetch(ownedGamesUrl);
        const ownedGamesData = await ownedGamesResponse.json();
        setOwnedGames(ownedGamesData.response.games);

        // Fetch recently played games
        const recentlyPlayedGamesUrl = `${proxyUrl}https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`;
        const recentlyPlayedGamesResponse = await fetch(recentlyPlayedGamesUrl);
        const recentlyPlayedGamesData = await recentlyPlayedGamesResponse.json();
        setRecentlyPlayedGames(recentlyPlayedGamesData.response.games);
      } catch (error) {
        console.error('Error al obtener los datos del jugador:', error);
        // Muestra un mensaje de error al usuario
      }
    };

    fetchPlayerData();
  }, [steamId]);

  return (
    <div>
      {playerSummary && (
        <div>
          <h2>{playerSummary.personaname}</h2>
          <img src={playerSummary.avatarfull} alt={playerSummary.personaname} />
        </div>
      )}

      {showAllGames && (
        <div>
          <h3>Owned Games</h3>
          <ul>
            {ownedGames && ownedGames.length > 0 && ownedGames.map((game) => (
              <li key={game.appid}>
                {game.name}
                <button
                  onClick={() => {
                    setAppId(game.appid);
                    fetchAchievements();
                  }}
                >
                  View Achievements
                </button>
              </li>
            ))}
          </ul>

          <h3>Recently Played Games</h3>
          <ul>
            {recentlyPlayedGames && recentlyPlayedGames.length > 0 && recentlyPlayedGames.map((game) => (
              <li key={game.appid}>{game.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SteamProfile;
