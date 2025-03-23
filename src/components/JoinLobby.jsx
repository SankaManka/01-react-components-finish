import React, { useState } from 'react';

const JoinLobbyModal = ({ isOpen, onClose, lobby_id }) => {
  const [lobby_password, setPassword] = useState('');

  const handleJoinLobby = async () => {
    if (!lobby_password) {
      alert('Пожалуйста, введите пароль.');
      return;
    }

    try {
      const response = await fetch('/api/lobbies/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            lobby_id: String(id_lobby),
            lobby_password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Вы успешно присоединились к лобби: ${data.lobby_name}`);
        onClose(); // Закрываем модальное окно
      } else {
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Ошибка при присоединении к лобби:', error);
      alert('Произошла ошибка при присоединении к лобби.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>Присоединиться к лобби</h4>
        <p>Введите пароль для лобби:</p>
        <input
          type="password"
          value={lobby_password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль лобби"
          className='lobby-passwd-input'
        />
        <div style={{ marginTop: '10px' }}>
          <button onClick={handleJoinLobby} className='create-lobby-btn-modal'>
            Присоединиться
          </button>
          <button onClick={onClose} className='close-modal-btn'>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinLobbyModal;