import { useEffect, useState, useRef } from 'react';
import LeaveLobby from "../components/LeaveLobby";
import CardAnimal from "../components/CardAnimal";
import CardProperty from "../components/CardProperty";
import PlayerHand from "../components/PlayerHand";
import EndTurn from "../components/EndTurn";
import OpponentHand from "../components/OpponentHand";
import { useParams } from 'react-router-dom';
import '../index.css';

export default function GamePage() {
  const { lobby_id, player_id } = useParams();
  const [gameStatus, setGameStatus] = useState('checking');
  const [countdown, setCountdown] = useState(null);
  const [playersReady, setPlayersReady] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [lobbyState, setLobbyState] = useState(null); // Для получения данных из get-lobby-state
  const pollingInterval = useRef(null);

  const lobbyId = parseInt(lobby_id);
  const playerId = parseInt(player_id);

  // Запрос статуса игры для определения начала игры
  useEffect(() => {
    const checkGameStatus = async () => {
      try {
        const response = await fetch(`/api/game/start/${lobbyId}`);
        const data = await response.json();

        if (data.status === "ok") {
          // Игра началась – прекращаем опрос
          setGameStatus('started');
          clearInterval(pollingInterval.current);
        } else {
          setGameStatus('waiting');
          setPlayersReady(data.players_ready || 0);
          setTotalPlayers(data.total_players || 0);
          if (data.countdown) setCountdown(data.countdown);
        }
      } catch (err) {
        console.error("Ошибка проверки статуса:", err);
        setGameStatus('waiting');
      }
    };

    // Первый запрос сразу при монтировании
    checkGameStatus();

    // Настраиваем интервал только если игра еще не начата
    if (gameStatus !== 'started') {
      pollingInterval.current = setInterval(checkGameStatus, 3000);
    }

    return () => {
      // Очищаем интервал при размонтировании
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [lobbyId, gameStatus]);

  // Дополнительный запрос для получения состояния лобби, включая информацию о животных
  useEffect(() => {
    const fetchLobbyState = async () => {
      try {
        const response = await fetch(`/api/game/get-lobby-state/${lobby_id}`);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        const data = await response.json();
        setLobbyState(data);
      } catch (err) {
        console.error('Ошибка получения состояния лобби:', err);
      }
    };

    fetchLobbyState();
    const interval = setInterval(fetchLobbyState, 1000);
    return () => clearInterval(interval);
  }, [lobby_id]);

  if (gameStatus === 'checking') {
    return (
      <div className="waiting-screen">
        <div className="loader"></div>
        <p>Подключаемся к игре...</p>
      </div>
    );
  }

  if (gameStatus === 'waiting') {
    return (
      <div className="game-container">
        <div className="waiting-content">
          <h2>Ожидание начала игры</h2>
          <div className="players-status">
            Готовы: 1 / 2 игроков
          </div>

          {countdown && (
            <div className="countdown">
              Игра начнётся через: {countdown} сек.
            </div>
          )}
          <div>
            <LeaveLobby />
          </div>
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="game-container">
      <div>
        <LeaveLobby />
      </div>
      <div className="game-field">
        <div className="opponent-section">
          <OpponentHand />
          {/* Если у игроков есть животные, отрисовываем их как карты */}
          <div className="opponent-properties">
            {lobbyState &&
              lobbyState.players.map(player => (
                player.animals && Array.isArray(player.animals) && player.animals.length > 0 && (
                  <div key={player.id} className="player-animals">
                    <h3>Игрок {player.id} ({player.color})</h3>
                    <div className="animals-cards">
                      {player.animals.map(animal => (
                        <CardAnimal
                          key={animal.id}
                          id={animal.id}
                          food={animal.food}
                          properties={animal.properties}
                        />
                      ))}
                    </div>
                  </div>
                )
              ))
            }
          </div>
        </div>
        <div className="main-player-container">
          <div>
            {/* Можно добавить информацию для главного игрока */}
          </div>
          <div className="main-player-deck">
            <PlayerHand />
            <div className="end-turn-button-container">
              <EndTurn />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
