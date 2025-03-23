import React, { useState } from 'react';
import JoinLobbyModal from './JoinLobby';

const Lobby = ({ lobby }) => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  if (!lobby || !lobby.id_lobby) {
    return null;
  }

  const { creator, max_turn_time, players, max_players, id_lobby } = lobby;

  return (
    <div className="lobby">
      {/* Верхний div */}
      <div className="lobby-top">
        <p><b>{creator}'s lobby</b></p>
        <p>Turn time: {max_turn_time}</p>
      </div>

      {/* Нижний div */}
      <div className="lobby-bottom">
        <p>{players} / {max_players} player</p>
        <button className='join-btn' onClick={() => setIsJoinModalOpen(true)}>
          Присоединиться
        </button>
      </div>

      {/* Модальное окно для присоединения к лобби */}
      <JoinLobbyModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        id_lobby={id_lobby}
      />
    </div>
  );
};

export default Lobby;