import { useEffect, useState } from 'react';
import CardAnimal from './CardAnimal';
import { useParams } from 'react-router-dom';

export default function OpponentHand() {
    const { player_id } = useParams();
    const [cardCount, setCardCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Основной запрос данных
    const fetchOppoCards = async () => {
        try {
            const response = await fetch(`/api/game/get-oppo-cards/${player_id}`);
            if (!response.ok) throw new Error('Ошибка загрузки карт');
            
            const data = await response.json();
            
            if (data.status === "ok") {
                const newCount = Math.max(0, Number(data.card_count) || 0);
                if (newCount !== cardCount) {
                    setCardCount(newCount);
                }
            } else {
                throw new Error(data.msg || 'Ошибка получения данных');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Запуск периодического обновления
    useEffect(() => {
        fetchOppoCards(); // Первый запрос сразу
        
        const interval = setInterval(fetchOppoCards, 3000); // Обновление каждые 3 секунды
        
        return () => clearInterval(interval);
    }, [player_id]);

    // Эффект для реакции на изменения cardCount
    useEffect(() => {
        if (cardCount > 0) {
            console.log(`Количество карт изменилось: ${cardCount}`);
            // Здесь можно добавить дополнительную логику при изменении количества
        }
    }, [cardCount]);

    if (loading) return <div>Загрузка карт оппонента...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className="opponent-hand">
            {Array.from({ length: cardCount }).map((_, index) => (
                <CardAnimal 
                    key={`opponent-card-${index}`}
                    position={index + 1}
                    total={cardCount}
                />
            ))}
        </div>
    );
}