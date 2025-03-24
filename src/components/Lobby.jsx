import { useState } from 'react';
import JoinLobbyModal from './JoinLobbyModal';
import '../index.css';

export default function Lobby({ lobby }) {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  if (!lobby) return null;

  return (
    <div className="lobby">
      <div className="lobby-top">
        <p><b>{lobby.creator}</b>'s lobby</p>
        <p>Время хода: {lobby.max_turn_time} сек</p>
      </div>
      <div className="lobby-bottom">
        <p>Игроков: {lobby.players}/{lobby.max_players}</p>
        <button 
          className="join-btn"
          onClick={() => setIsJoinModalOpen(true)}
        >
          Присоединиться
        </button>
      </div>

      <JoinLobbyModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        lobbyId={lobby.id_lobby}
      />
    </div>
  );
};