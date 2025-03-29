import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../index.css';

export default function EndTurn({ player_id }) {
  const { lobby_id } = useParams();
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTurnEnded, setIsTurnEnded] = useState(false);
  const [isPhaseEnded, setIsPhaseEnded] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null); // Текущий игрок

  // Форматирование времени
  const formatTime = (seconds) => {
    const safeSeconds = Math.max(0, Math.floor(seconds)) || 0;
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Получение названия фазы
  const getPhaseName = (phaseNumber) => {
    switch (phaseNumber) {
      case 1: return 'Фаза развития';
      case 3: return 'Фаза питания';
      default: return 'Неизвестная фаза';
    }
  };

  // Запрос данных с сервера
  const fetchGameState = async () => {
    try {
      const response = await fetch(`/api/game/get-lobby-state/${lobby_id}`);
      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
      
      const data = await response.json();

      if (data.phase_timing && typeof data.phase === 'number' && typeof data.round === 'number' && data.current_player) {
        setGameState({
          round: data.round,
          phase: data.phase,
          phaseName: getPhaseName(data.phase),
          remainingTime: data.phase_timing.remaining,
          maxDuration: data.phase_timing.max_duration
        });
        setCurrentPlayer(data.current_player); // Обновляем текущего игрока
      } else {
        throw new Error('Некорректные данные игры');
      }
    } catch (err) {
      setError(err.message);
      console.error('Ошибка:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameState();
    const interval = setInterval(fetchGameState, 1000);
    return () => clearInterval(interval);
  }, [lobby_id]);

  useEffect(() => {
    setIsTurnEnded(false); // Сбрасываем завершение хода при смене игрока
    setIsPhaseEnded(false); // Сбрасываем завершение фазы при смене фазы
  }, [currentPlayer, gameState?.phase]);

  // Завершение хода
  const handleEndTurn = async () => {
    if (isTurnEnded || player_id !== currentPlayer) return;

    try {
      const response = await fetch(`/api/game/switch-player/${lobby_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_id })
      });

      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
      
      setIsTurnEnded(true); // Блокируем повторное нажатие
    } catch (err) {
      console.error('Ошибка при завершении хода:', err);
    }
  };

  // Завершение фазы
  const handleEndPhase = () => {
    if (isPhaseEnded) return;
    setIsPhaseEnded(true);
    console.log('Фаза завершена!');
  };

  // Стили кнопок
  const buttonStyleTurn = isTurnEnded || player_id !== currentPlayer 
    ? { backgroundColor: '#ff4444', color: '#ffe6e6', cursor: 'not-allowed' }
    : {};

  const buttonStylePhase = isPhaseEnded 
    ? { backgroundColor: '#ff4444', color: '#ffe6e6', cursor: 'not-allowed' } 
    : {};

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="countdown-container">
      <div className="game-meta">
        <div className="round-info">Раунд: {gameState.round}</div>
        <div className="phase-info">{gameState.phaseName}</div>
      </div>

      <div className="timer-display">
        <div className="time-info">
          <span>Осталось: {formatTime(gameState.remainingTime)}</span>
        </div>

        {gameState.phase !== 1 && (
          <button 
            className="end-btn"
            onClick={handleEndTurn}
            style={buttonStyleTurn}
            disabled={isTurnEnded || player_id !== currentPlayer} 
          >
            {isTurnEnded ? 'Ход завершен' : 'Завершить ход'}
          </button>
        )}

        {gameState.phase !== 1 && (
          <button 
            className="change-phase-btn"
            onClick={handleEndPhase}
            style={buttonStylePhase}
            disabled={isPhaseEnded}
          >
            {isPhaseEnded ? 'Фаза завершена' : 'Завершить фазу'}
          </button>
        )}
      </div>
    </div>
  );
}
