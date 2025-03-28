import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

export default function JoinLobbyModal({ isOpen, onClose, lobbyId }) {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    try {
      const response = await fetch('/api/lobbies/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lobby_id: lobbyId,
          lobby_password: password
        }),
      });

      if (response.ok) {
        const joinLobby = await response.json();
        navigate(`/game/${lobbyId}/${joinLobby.player_id}`); // Переход в игру
      } else {
        alert('Неверный пароль');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content join-modal">
      <h4>Присоединиться к лобби</h4>
      <p>Введите пароль для лобби:</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль лобби"
          className='lobby-passwd-input'
        />
        <div className="modal-actions">
          <button onClick={handleJoin} className='create-lobby-btn-modal'>Войти</button>
          <button onClick={onClose} className="close-modal-btn">Отмена</button>
        </div>
      </div>
    </div>
  );
};
