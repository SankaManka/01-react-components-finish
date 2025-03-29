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
  const [lobbyState, setLobbyState] = useState(null);
  // Состояние для выбранной карты свойства из руки
  const [propertyPlayCardId, setPropertyPlayCardId] = useState(null);
  const pollingInterval = useRef(null);

  const lobbyId = parseInt(lobby_id);
  const playerId = parseInt(player_id);

  // Функция для обработки клика по карточке животного
  const handleAnimalCardClick = async (animalId) => {
    // Если не выбрана карта свойства — ничего не делаем
    if (!propertyPlayCardId) return;
    try {
      const response = await fetch(`/api/game/play-property/${propertyPlayCardId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ animal_id: animalId })
      });
      const data = await response.json();
      console.log('Ответ сервера на сыгранное свойство:', data);
      // Сброс выбранной карты после удачного запроса
      setPropertyPlayCardId(null);
      // Обновление состояния лобби, если требуется
      fetchLobbyState();
    } catch (err) {
      console.error('Ошибка при игре свойства:', err);
    }
  };

  // Запрос статуса игры для определения начала игры
  useEffect(() => {
    const checkGameStatus = async () => {
      try {
        const response = await fetch(`/api/game/start/${lobbyId}`);
        const data = await response.json();

        if (data.status === "ok") {
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

    checkGameStatus();

    if (gameStatus !== 'started') {
      pollingInterval.current = setInterval(checkGameStatus, 3000);
    }

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [lobbyId, gameStatus]);

  // Запрос состояния лобби
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

  useEffect(() => {
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
        <div>
          <LeaveLobby />
        </div>
        <div className="waiting-content">
          <h2>Ожидание начала игры</h2>
          <div className="players-status">
            Готовы: {playersReady} / {totalPlayers} игроков
          </div>
          {countdown && (
            <div className="countdown">
              Игра начнётся через: {countdown} сек.
            </div>
          )}
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="game-container">
      <LeaveLobby />
      <div className="game-field">
        <div className="opponent-section">
          <OpponentHand />
          <div className="opponent-properties">
            {lobbyState &&
              lobbyState.players
                .filter(player => player.id !== playerId)
                .map(player => (
                  player.animals &&
                  Array.isArray(player.animals) &&
                  player.animals.length > 0 && (
                    <div key={player.id} className="player-animals">
                      <div className="animals-cards">
                        {player.animals.map(animal => (
                          // Если пользователь уже выбрал карту свойства,
                          // кликая по карточке животного вызываем handleAnimalCardClick
                          <div 
                            key={animal.id} 
                            onClick={() => propertyPlayCardId && handleAnimalCardClick(animal.id)}
                          >
                            <CardAnimal
                              id={animal.id}
                              food={animal.food}
                              properties={animal.properties}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))
            }
          </div>
        </div>
        <div className="main-player-container">
          <div className="main-player-properties">
            {lobbyState &&
              lobbyState.players
                .filter(player => player.id === playerId)
                .map(player => (
                  player.animals &&
                  Array.isArray(player.animals) &&
                  player.animals.length > 0 && (
                    <div key={player.id} className="player-animals">
                      <div className="animals-cards">
                        {player.animals.map(animal => (
                          // Также можно разрешить выбор и своих животных, если это нужно
                          <div 
                            key={animal.id} 
                            onClick={() => propertyPlayCardId && handleAnimalCardClick(animal.id)}
                          >
                            <CardAnimal
                              id={animal.id}
                              food={animal.food}
                              properties={animal.properties}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))
            }
          </div>
          <div className="main-player-deck">
            {/* Передаём колбэк для выбора карты свойства */}
            <PlayerHand onPropertySelect={(cardId) => setPropertyPlayCardId(cardId)} />
            <div className="end-turn-button-container">
              <EndTurn />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
