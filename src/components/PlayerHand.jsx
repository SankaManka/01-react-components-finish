import { useEffect, useState } from 'react';
import CardProperty from './CardProperty';
import { useParams } from 'react-router-dom';

export default function PlayerHand() {
    const { player_id } = useParams();
    const [hand, setHand] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCardId, setSelectedCardId] = useState(null);

    const handleCardClick = (cardId) => {
        setSelectedCardId(selectedCardId === cardId ? null : cardId);
    };

    const handleAction = (actionType) => {
        console.log(`Выбрано действие: ${actionType} для карты ${selectedCardId}`);
        setSelectedCardId(null);
    };

    useEffect(() => {
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

        fetchPlayerHand();
    }, [player_id]);

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