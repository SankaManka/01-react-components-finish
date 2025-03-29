import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../index.css';

export default function EndTurn() {
  const { lobby_id } = useParams();
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPhaseEnded, setIsPhaseEnded] = useState(false);  // Состояние для отслеживания, завершена ли фаза

  // Форматирование времени
  const formatTime = (seconds) => {
    const safeSeconds = Math.max(0, Math.floor(seconds)) || 0;
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Получение названия фазы
  const getPhaseName = (phaseNumber) => {
    switch(phaseNumber) {
      case 1: return 'Фаза развития';
      case 3: return 'Фаза питания';
      // default: return 'Неизвестная фаза';
    }
  };

  // Запрос данных с сервера
  const fetchGameState = async () => {
    try {
      const response = await fetch(`/api/game/get-lobby-state/${lobby_id}`);
      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
      
      const data = await response.json();
      
      if (data.phase_timing && typeof data.phase === 'number' && typeof data.round === 'number') {
        setGameState({
          round: data.round,
          phase: data.phase,
          phaseName: getPhaseName(data.phase),
          remainingTime: data.phase_timing.remaining,
          maxDuration: data.phase_timing.max_duration
        });
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
    // Если фаза меняется, сбрасываем состояние кнопки
    setIsPhaseEnded(false);
  }, [gameState?.phase]);  // Сброс при изменении фазы

  const handleEndPhase = () => {
    if (isPhaseEnded) {
      return;  // Если фаза уже завершена, не выполняем действия
    }

    setIsPhaseEnded(true);  // Фаза завершена
    console.log('Фаза завершена!');
    // Здесь можно выполнить запрос на сервер для завершения фазы, например:
    // await fetch('/api/game/end-phase', { method: 'POST' });
  };

  // Стиль кнопки, если фаза завершена
  const buttonStyle = isPhaseEnded
    ? { backgroundColor: '#ff4444', color: '#ffe6e6' }
    : {};

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="countdown-container">
      {/* Блок с общей информацией */}
      <div className="game-meta">
        <div className="round-info">Раунд: {gameState.round}</div>
        <div className="phase-info">{gameState.phaseName}</div>
      </div>

      {/* Блок с таймером и кнопкой (если не Фаза развития) */}
      <div className="timer-display">
        <div className="time-info">
          <span>Осталось: {formatTime(gameState.remainingTime)}</span>
        </div>
        {gameState.phase !== 1 && (
          <button 
            className="end-btn"
            onClick={() => console.log('Завершение хода')}
          >
            Завершить ход
          </button>
        )}
        {gameState.phase !== 1 && !isPhaseEnded && (
          <button 
            className="change-phase-btn"
            onClick={handleEndPhase}
            style={buttonStyle}  // Применение стиля к кнопке
          >
            Завершить фазу
          </button>
        )}
        {gameState.phase !== 1 && isPhaseEnded && (
          <button 
            className="change-phase-btn"
            disabled
            style={buttonStyle}  // Применение стиля к кнопке
          >
            Фаза завершена
          </button>
        )}
      </div>
    </div>
  );
}
