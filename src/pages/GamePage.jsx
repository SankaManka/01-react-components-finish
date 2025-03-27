import LeaveLobby from "../components/LeaveLobby";
import CardAnimal from "../components/CardAnimal";
import CardProperty from "../components/CardProperty";
import EndTurn from "../components/EndTurn";
import { useParams, useNavigate } from 'react-router-dom';

export default function GamePage() {
    // Получаем параметры из URL
  const { lobby_id, player_id } = useParams();
  const navigate = useNavigate();

  // Конвертируем в числа (опционально)
  const lobbyId = parseInt(lobby_id);
  const playerId = parseInt(player_id);

  // Пример использования
  const handleAction = () => {
    console.log('Lobby ID:', lobbyId);
    console.log('Player ID:', playerId);
    
    // Можно использовать для API-запросов
    fetch(`/api/lobbies/${lobbyId}/players/${playerId}`, {
      method: 'POST'
    });
  };
    return (
        <main className="game-container">
            <div>
                <LeaveLobby />
            </div>
            <div className="game-field">
                <div>
                    <div>
                        <CardAnimal />
                    </div>
                    <div>
                        <CardProperty />
                    </div>
                </div>
                <div className="main-player-container">
                    <div>
                        <CardProperty />
                    </div>
                    <div className="main-player-deck">
                        <div className="main-player-cards">
                            <CardProperty />
                            <CardProperty />
                            <CardProperty />
                            <CardProperty />
                            <CardProperty />
                            <CardProperty />
                        </div>
                        <div className="end-turn-button-container">
                            <EndTurn />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}