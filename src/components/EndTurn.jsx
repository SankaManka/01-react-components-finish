import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../index.css';

export default function EndTurn({ player_id }) {
  const { lobby_id } = useParams();
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTurnEnded, setIsTurnEnded] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [endedPhases, setEndedPhases] = useState(new Set()); // Храним завершенные фазы

  const formatTime = (seconds) => {
    const safeSeconds = Math.max(0, Math.floor(seconds)) || 0;
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseName = (phaseNumber) => {
    switch (phaseNumber) {
      case 1: return 'Фаза развития';
      case 3: return 'Фаза питания';
      default: return 'Неизвестная фаза';
    }
  };

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
        setCurrentPlayer(data.phase !== 1 ? data.current_player : null);
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

  // Сбрасываем завершение хода при смене игрока
  useEffect(() => {
    if (gameState?.phase !== 1) {
      setIsTurnEnded(false);
    }
  }, [currentPlayer]);

  const handleEndTurn = async () => {
    if (isTurnEnded || player_id !== currentPlayer) return;

    try {
      const response = await fetch(`/api/game/switch-player/${lobby_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_id })
      });
      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
      setIsTurnEnded(true);
    } catch (err) {
      console.error('Ошибка при завершении хода:', err);
    }
  };

  const handleEndPhase = async () => {
    const phaseKey = `${gameState.round}-${gameState.phase}`; // Уникальный ключ для фазы и раунда
    if (endedPhases.has(phaseKey)) return;

    try {
      const response = await fetch(`/api/game/next-phase/${player_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
      setEndedPhases(prev => new Set([...prev, phaseKey])); // Блокируем кнопку для текущей фазы
    } catch (err) {
      console.error('Ошибка при завершении фазы:', err);
    }
  };

  const buttonStyleTurn = isTurnEnded || player_id !== currentPlayer
    ? { backgroundColor: '#ff4444', color: '#ffe6e6', cursor: 'not-allowed' }
    : {};

  const buttonStylePhase = endedPhases.has(`${gameState?.round}-${gameState?.phase}`)
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
          <>
            <button
              className="end-btn"
              onClick={handleEndTurn}
              style={buttonStyleTurn}
              disabled={isTurnEnded || player_id !== currentPlayer}
            >
              Завершить ход
            </button>

            <button
              className="change-phase-btn"
              onClick={handleEndPhase}
              style={buttonStylePhase}
              disabled={endedPhases.has(`${gameState.round}-${gameState.phase}`)}
            >
              Завершить фазу
            </button>
          </>
        )}
      </div>
    </div>
  );
}