import { useState, useEffect } from 'react';
import CardProperty from './CardProperty';
import { useParams } from 'react-router-dom';

export default function PlayerHand({
  onPropertySelect,
  playerHand,
  fetchLobbyState,
  fetchPlayerHand
}) {
  const { player_id, lobby_id } = useParams();
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [gameState, setGameState] = useState(null);

  const handleCardClick = (cardId) => {
    setSelectedCardId(selectedCardId === cardId ? null : cardId);
  };

  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const response = await fetch(`/api/game/get-lobby-state/${lobby_id}`);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        const data = await response.json();
        setGameState(data);
      } catch (err) {
        console.error('Ошибка получения состояния игры:', err);
      }
    };

    fetchGameState();
    const interval = setInterval(fetchGameState, 1000);
    return () => clearInterval(interval);
  }, [lobby_id]);

  const handleAction = async (actionType) => {
    if (!gameState || gameState.phase !== 1) {
      alert('Действие можно выполнить только в фазе развития');
      return;
    }

    try {
      if (actionType === 'animal' && selectedCardId) {
        await fetch(`/api/game/play-animal/${selectedCardId}`, {
          method: 'POST'
        });
      }

      fetchLobbyState();
      fetchPlayerHand();
    } catch (err) {
      console.error("Ошибка:", err);
    }

    setSelectedCardId(null);
    if (actionType === 'property') {
      onPropertySelect(selectedCardId);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.card-property') && !e.target.closest('.card-actions')) {
        setSelectedCardId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (!playerHand?.length) return <div className="empty">Нет карт в руке</div>;

  return (
    <div className="main-player-cards">
      {playerHand.map(card => (
        <div key={card.card_instance_id} className="card-wrapper">
          <CardProperty
            name={card.card_type_name}
            description={card.card_description}
            foodValue={card.food_value}
            isPredator={card.is_predator}
            onClick={() => handleCardClick(card.card_instance_id)}
            isSelected={selectedCardId === card.card_instance_id}
            card_instance_id={card.card_instance_id}
          />
          {selectedCardId === card.card_instance_id && (
            <div className="card-actions">
              <button onClick={() => handleAction('animal')}>Сыграть животное</button>
              <button onClick={() => handleAction('property')}>Сыграть свойство</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}