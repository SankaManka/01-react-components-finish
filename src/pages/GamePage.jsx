import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import LeaveLobby from "../components/LeaveLobby";
import AnimalWithPropertyBadge from "../components/AnimalWithPropertyBadge";
import CardProperty from "../components/CardProperty";
import PlayerHand from "../components/PlayerHand";
import EndTurn from "../components/EndTurn";
import OpponentHand from "../components/OpponentHand";
import FoodChip from '../components/FoodChip';
import '../index.css';
import CardAnimal from '../components/CardAnimal';
import Deck from '../components/Deck';

export default function GamePage() {
  const { lobby_id, player_id } = useParams();
  const [gameStatus, setGameStatus] = useState('checking');
  const [countdown, setCountdown] = useState(null);
  const [playersReady, setPlayersReady] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [lobbyState, setLobbyState] = useState(null);
  const [propertyPlayCardId, setPropertyPlayCardId] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const pollingInterval = useRef(null);

  const lobbyId = parseInt(lobby_id);
  const playerId = parseInt(player_id);

  const handleAnimalCardClick = async (animalId) => {
    if (!propertyPlayCardId) return;
    try {
      const response = await fetch(`/api/game/play-property/${propertyPlayCardId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ animal_id: animalId })
      });
      await response.json();
      fetchLobbyState();
      fetchPlayerHand();
      setPropertyPlayCardId(null);
    } catch (err) {
      console.error('Ошибка при игре свойства:', err);
    }
  };

  const handleFeedAnimal = async (animalId, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/game/take-food/${animalId}`, {
        method: 'POST'
      });
      if (response.ok) {
        // Используем функциональное обновление состояния для сохранения порядка
        setLobbyState(prev => {
          if (!prev) return null;
          return {
            ...prev,
            players: prev.players.map(player => ({
              ...player,
              animals: player.animals?.map(animal =>
                animal.id === animalId
                  ? {...animal, food: animal.food + 1}
                  : animal
              )
            }))
          };
        });
        // Полное обновление через секунду
        setTimeout(fetchLobbyState, 1000);
      }
    } catch (err) {
      console.error('Ошибка при кормлении:', err);
    }
  };

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

  const fetchPlayerHand = async () => {
    try {
      const response = await fetch(`/api/game/get-player-hand/${playerId}`);
      if (!response.ok) throw new Error('Ошибка загрузки карт');
      const data = await response.json();
      if (data.status === "ok" && Array.isArray(data.cards)) {
        setPlayerHand(data.cards);
      }
    } catch (err) {
      console.error('Ошибка при загрузке руки:', err);
    }
  };

  useEffect(() => {
    const updateData = () => {
      fetchLobbyState();
      fetchPlayerHand();
    };

    updateData();
    const interval = setInterval(updateData, 1000);
    return () => clearInterval(interval);
  }, [lobby_id, playerId]);

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
            Готовы: 1 / 2 игроков
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

// Экран окончания игры
if (lobbyState?.game_finished) {
  const winnerId = lobbyState.winner;
  const isWinner = winnerId === playerId;
  return (
    <div className="game-container">
      <div className="game-end-screen">
        <h1>{isWinner ? 'Поздравляем! Вы победили!' : 'Вы проиграли!'}</h1>
        <div className="winner-info">
        </div>
        <LeaveLobby />
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
                          <div
                            key={animal.id}
                            onClick={() => propertyPlayCardId && handleAnimalCardClick(animal.id)}
                          >
                            <AnimalWithPropertyBadge
                              id={animal.id}
                              food={animal.food}
                              properties={animal.properties}
                              onClick={() => propertyPlayCardId && handleAnimalCardClick(animal.id)}
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
        <div className='deck-parent-container'>
          {lobbyState && <Deck deckCount={lobbyState.deck_count} />}
        </div>
        <div className='player-turn-status'>
          <span>{
            lobbyState &&
            (lobbyState.current_player === undefined ||
              lobbyState.current_player === null ||
              lobbyState.current_player === playerId)
              ? 'Ваш ход'
              : 'Ход противника'}
          </span>
        </div>
        <div className='food-chip-parent-container'>
          {lobbyState && <FoodChip currentFood={lobbyState.food.current} />}
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
                          <div
                            key={animal.id}
                            onClick={() => propertyPlayCardId && handleAnimalCardClick(animal.id)}
                          >
                            <AnimalWithPropertyBadge
                              id={animal.id}
                              food={animal.food}
                              properties={animal.properties}
                              onClick={() => propertyPlayCardId && handleAnimalCardClick(animal.id)}
                            />
                            {lobbyState.phase === 3 && (
                              <button
                                className="feed-button"
                                onClick={(e) => handleFeedAnimal(animal.id, e)}
                              >
                                Покормить
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))
            }
          </div>
          <div className="main-player-deck">
            <PlayerHand
              onPropertySelect={setPropertyPlayCardId}
              playerHand={playerHand}
              fetchLobbyState={fetchLobbyState}
              fetchPlayerHand={fetchPlayerHand}
            />
            <div className="end-turn-button-container">
              <EndTurn player_id={playerId} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}