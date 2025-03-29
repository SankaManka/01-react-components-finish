import { useEffect, useState } from 'react';
import CardProperty from './CardProperty';
import { useParams } from 'react-router-dom';

export default function PlayerHand({ onPropertySelect }) {
  const { player_id, lobby_id } = useParams();
  const [hand, setHand] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [gameState, setGameState] = useState(null);

  const handleCardClick = (cardId) => {
    setSelectedCardId(selectedCardId === cardId ? null : cardId);
  };

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

  const fetchPlayerHand = async () => {
    try {
      const response = await fetch(`/api/game/get-player-hand/${player_id}`);
      if (!response.ok) throw new Error('Ошибка загрузки карт');
      const data = await response.json();
      if (data.status === "ok" && Array.isArray(data.cards)) {
        setHand(data.cards);
      } else {
        throw new Error(data.msg || 'Ошибка получения карт');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerHand();
  }, [player_id]);

  useEffect(() => {
    fetchGameState();
    const interval = setInterval(fetchGameState, 1000);
    return () => clearInterval(interval);
  }, [lobby_id]);

  const handleAction = async (actionType) => {
    // Проверяем, что действие выполняется только в фазе развития
    if (!gameState || gameState.phase !== 1) {
      alert('Действие можно выполнить только в фазе развития');
      return;
    }

    if (actionType === 'animal' && selectedCardId) {
      try {
        const response = await fetch(`/api/game/play-animal/${selectedCardId}`, {
          method: 'POST'
        });
        if (!response.ok) {
          throw new Error('Ошибка при выполнении запроса');
        }
        const data = await response.json();
        console.log("Ответ сервера:", data);
        fetchGameState();
        fetchPlayerHand();
      } catch (err) {
        console.error("Ошибка:", err);
      }
    } else if (actionType === 'property' && selectedCardId) {
      // Вместо прямого запроса передаём id выбранной карты родительскому компоненту
      onPropertySelect(selectedCardId);
      fetchGameState();
      fetchPlayerHand();
      console.log(`Карта свойства ${selectedCardId} выбрана, нажмите на животное для применения`);
    }
    // Если действие было выполнено (или выбор сделан), сбрасываем выбор карты в руке
    setSelectedCardId(null);
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

  if (loading) return <div className="loading">Загрузка карт...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;
  if (!hand.length) return <div className="empty">Нет карт в руке</div>;

  return (
    <div className="main-player-cards">
      {hand.map(card => (
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
