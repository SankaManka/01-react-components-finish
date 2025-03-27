import { useState } from 'react';
import '../index.css';

export default function CreateLobbyModal({ isOpen, onClose, navigate }) {
  const [password, setPassword] = useState('');
  const [selectedTime, setSelectedTime] = useState(30);

  const createLobby = async () => {
    if (!password) {
      alert('Пожалуйста, введите пароль');
      return;
    }

    try {
      const response = await fetch('/api/lobbies/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password: password,
          max_turn_time: selectedTime 
        }),
      });

      if (response.ok) {
        const newLobby = await response.json();
        onClose(); // Закрываем модальное окно
        navigate(`/game/${newLobby.lobby_id}/${newLobby.player_id}`);
      } else {
        alert('Ошибка при создании лобби');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      // Очищаем поля после отправки
      setPassword('');
      setSelectedTime(30);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content create-modal">
        <p className='p-heading'>Создать лобби</p>
        <div className='time-chose-container'>
          <label className='p'>Время хода:</label>
          {[30, 60, 90].map(time => (
            <label key={time}>
              <input
                type="radio"
                checked={selectedTime === time}
                onChange={() => setSelectedTime(time)}
              />
              {time} сек
            </label>
          ))}
        </div>
        <p className='p'>Придумайте пароль для лобби:</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль лобби"
          className='lobby-passwd-input'
        />
        <div className="modal-actions">
          <button onClick={createLobby} className="create-lobby-btn-modal">
            Создать
          </button>
          <button onClick={onClose} className="close-modal-btn">
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};