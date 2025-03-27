import { useState, useEffect, useRef } from 'react';
import '../index.css'

export default function EndTurn() {
  const [timeLeft, setTimeLeft] = useState(300); // 5 минут в секундах
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Форматирование времени в MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Запуск таймера
  const startTimer = () => {
    setIsRunning(true);
  };

  // Завершение хода
  const endTurn = () => {
    setIsRunning(false);
    setTimeLeft(300); // Сброс до 5 минут
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  return (
    <div className="countdown-container">
      <div className="timer-display">Оставшееся время: {formatTime(timeLeft)}</div>
      
      <div className="controls">
        {!isRunning ? (
          <button onClick={startTimer} className="start-btn">
            Старт (5:00)
          </button>
        ) : (
          <button onClick={endTurn} className="end-btn">
            Завершить ход
          </button>
        )}
      </div>
    </div>
  );
}