import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';
import '../index.css';

export default function LeaveLobby() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { player_id } = useParams();
  const navigate = useNavigate();
//   const user = useAuthStore(state => state.user);

  const handleLeave = async () => {
    if (!window.confirm('Вы уверены, что хотите покинуть лобби?')) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/lobbies/leave/${player_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.status === 'ok') {
        // Обновляем состояние хранилища при необходимости
        navigate('/lobby'); // Перенаправляем в лобби
      } else {
        setError(data.msg || 'Ошибка при выходе из лобби');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      setError('Не удалось подключиться к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button 
        className="leave-lobby-btn" 
        onClick={handleLeave}
        disabled={isLoading}
      >
        {isLoading ? 'Выход...' : 'Покинуть игру'}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}