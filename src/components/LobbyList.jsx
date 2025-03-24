import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lobby from './Lobby';
import JoinLobbyModal from './JoinLobbyModal';
import CreateLobbyModal from './CreateLobbyModal';
import '../index.css';

export default function LobbyList() {
  const [lobbies, setLobbies] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedLobbyId, setSelectedLobbyId] = useState(null);
  const navigate = useNavigate();

  const fetchLobbies = async () => {
    try {
      const response = await fetch('/api/lobbies');
      const data = await response.json();
      setLobbies(data);
    } catch (error) {
      console.error('Ошибка загрузки лобби:', error);
    }
  };

  useEffect(() => {
    fetchLobbies();
    const interval = setInterval(fetchLobbies, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="lobby-container">
      <div className='lobby-parent'>
        {lobbies.length > 0 ? (
          lobbies.map(lobby => (
            <Lobby 
              key={lobby.id_lobby} 
              lobby={lobby}
              onJoinClick={() => {
                setSelectedLobbyId(lobby.id_lobby);
                setIsJoinModalOpen(true);
              }}
            />
          ))
        ) : (
          <p>Нет активных лобби</p>
        )}
      </div>

      <button 
        className='create-lobby-btn'
        onClick={() => setIsCreateModalOpen(true)}
      >
        Создать лобби
      </button>

      <CreateLobbyModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        navigate={navigate}
      />

      <JoinLobbyModal 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)}
        lobbyId={selectedLobbyId}
        navigate={navigate}
      />
    </div>
  );
}