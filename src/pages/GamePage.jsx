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
  const [usedTopatuns, setUsedTopatuns] = useState(new Set());
  const [usedSpyachkas, setUsedSpyachkas] = useState(new Set());
  const [predatorMode, setPredatorMode] = useState({
  active: false,
  predatorId: null
});
const activatePredatorMode = (animalId, e) => {
  e.stopPropagation();
  if (usedPredators.has(animalId) || predatorMode.active) return;
  setPredatorMode({
    active: true,
    predatorId: animalId
  });
};
  const [usedPredators, setUsedPredators] = useState(new Set());

  useEffect(() => {
  if (lobbyState?.phase !== 3) {
    setUsedPredators(new Set());
  }
}, [lobbyState?.phase]);

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
      const data = await response.json();
      if (data.status === 'error') {
          alert(data.msg);
      }
      // Обновляем только локальное состояние
      setLobbyState(prev => {
        if (!prev) return null;
        return {
          ...prev,
          players: prev.players.map(player => ({
            ...player,
            animals: player.animals
              ?.map(animal =>
                animal.id === animalId
                  ? {...animal, food: animal.food + 1}
                  : animal
              )
              // Сортируем животных после обновления
              .sort((a, b) => a.id - b.id)
          }))
        };
      });
    }
  } catch (err) {
    console.error('Ошибка при кормлении:', err);
  }
};

const handleTopatun = async (animalId, e) => {
  e.stopPropagation();
  try {
    const response = await fetch(`/api/game/use-topatun/${animalId}`, {
      method: 'POST'
    });
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'error') {
        alert(data.msg);
      } else {
        setUsedTopatuns(prev => new Set(prev).add(animalId));
      }
      fetchLobbyState();
    }
  } catch (err) {
    console.error('Ошибка при использовании Топотуна:', err);
  }
};
const handleSpyachka = async (animalId, e) => {
  e.stopPropagation();
  if (usedSpyachkas.has(animalId)) return;

  try {
    const response = await fetch(`/api/game/use-spyachka/${animalId}`, {
      method: 'POST'
    });
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'error') {
        alert(data.msg);
      } else {
        setUsedSpyachkas(prev => new Set(prev).add(animalId));
      }
      fetchLobbyState();
    }
  } catch (err) {
    console.error('Ошибка при использовании Спячки:', err);
  }
};
const handlePredatorAttack = async (targetAnimalId) => {
  if (!predatorMode.active || usedPredators.has(predatorMode.predatorId)) return;

  // Добавляем флаг для предотвращения множественных вызовов
  if (this.predatorAttackInProgress) return;
  this.predatorAttackInProgress = true;

  try {
    console.log("Sending predator attack request");
    const response = await fetch(`/api/game/use-predator/${predatorMode.predatorId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ target_animal_id: targetAnimalId })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === 'error') {
        alert(data.msg);
      } else {
        setUsedPredators(prev => new Set(prev).add(predatorMode.predatorId));
      }
      fetchLobbyState();
    }
  } catch (err) {
    console.error('Ошибка при атаке хищника:', err);
  } finally {
    this.predatorAttackInProgress = false;
    setPredatorMode({ active: false, predatorId: null });
  }
};
// Сброс при смене фазы
useEffect(() => {
  if (lobbyState?.phase !== 3) {
    setUsedSpyachkas(new Set());
  }
}, [lobbyState?.phase]);
useEffect(() => {
  if (lobbyState?.phase !== 3) {
    setUsedTopatuns(new Set());
  }
}, [lobbyState?.phase]);

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
          <OpponentHand/>
          {predatorMode.active && (
        <div className="predator-mode-indicator">
          Выберите цель для атаки хищника
          <button
            onClick={() => setPredatorMode({ active: false, predatorId: null })}
            className="cancel-predator-button"
          >
            Отменить
          </button>
        </div>
      )}
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
                                {player.animals
                                    .sort((a, b) => a.id - b.id)
                                    .map(animal => (
                                        <div
                                            key={animal.id}
                                            onClick={() => {
                                              if (predatorMode.active) {
                                                handlePredatorAttack(animal.id);
                                              }
                                            }}
                                            className={predatorMode.active ? 'attack-target' : ''}
                                        >
                                          <AnimalWithPropertyBadge
                                              id={animal.id}
                                              food={animal.food}
                                              properties={animal.properties}
                                              onClick={(e) => {
                                                if (predatorMode.active) {
                                                  e.stopPropagation(); // Добавляем stopPropagation
                                                  handlePredatorAttack(animal.id);
                                                } else if (propertyPlayCardId) {
                                                  handleAnimalCardClick(animal.id);
                                                }
                                              }}
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
          {lobbyState && <Deck deckCount={lobbyState.deck_count}/>}
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
          {lobbyState && <FoodChip currentFood={lobbyState.food.current}/>}
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
                                {player.animals
                                    .sort((a, b) => a.id - b.id)
                                    .map(animal => (
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
                                              <div className="animal-actions">
                                                <button
                                                    className="feed-button"
                                                    onClick={(e) => handleFeedAnimal(animal.id, e)}
                                                >
                                                  Покормить
                                                </button>
                                                {animal.properties?.some(prop => prop.name === 'Топотун') && (
                                                    <button
                                                        className="topatun-button"
                                                        onClick={(e) => handleTopatun(animal.id, e)}
                                                        disabled={usedTopatuns.has(animal.id)}
                                                    >
                                                      Топотун
                                                    </button>
                                                )}
                                                {animal.properties?.some(prop => prop.name === 'Спячка') && (
                                                    <button
                                                        className="spyachka-button"
                                                        onClick={(e) => handleSpyachka(animal.id, e)}
                                                        disabled={usedSpyachkas.has(animal.id)}
                                                    >
                                                      Спячка
                                                    </button>
                                                )}
                                                {animal.properties?.some(prop => prop.name === 'Хищник') && (
                                                    <button
                                                      className="predator-button"
                                                      onClick={(e) => activatePredatorMode(animal.id, e)}
                                                      disabled={usedPredators.has(animal.id) || predatorMode.active}
                                                    >
                                                      Атаковать
                                                    </button>
                                                  )}
                                              </div>
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
              <EndTurn player_id={playerId}/>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}