import { useEffect, useState, useRef } from 'react';
import LeaveLobby from "../components/LeaveLobby";
import CardAnimal from "../components/CardAnimal";
import CardProperty from "../components/CardProperty";
import PlayerHand from "../components/PlayerHand";
import EndTurn from "../components/EndTurn";
import OpponentHand from "../components/OpponentHand";
import { useParams } from 'react-router-dom';
import '../index.css';

export default function GamePage() {
    const { lobby_id, player_id } = useParams();
    const [gameStatus, setGameStatus] = useState('checking');
    const [countdown, setCountdown] = useState(null);
    const [playersReady, setPlayersReady] = useState(0);
    const [totalPlayers, setTotalPlayers] = useState(0);
    const pollingInterval = useRef(null);

    const lobbyId = parseInt(lobby_id);
    const playerId = parseInt(player_id);

    useEffect(() => {
        const checkGameStatus = async () => {
            try {
                const response = await fetch(`/api/game/start/${lobbyId}`);
                const data = await response.json();
                
                if (data.status === "ok") {
                    // Игра началась - прекращаем опрос
                    setGameStatus('started');
                    clearInterval(pollingInterval.current);
                } else {
                    setGameStatus('waiting');
                    setPlayersReady(data.players_ready || 0);
                    setTotalPlayers(data.total_players || 0);
                    if (data.countdown) setCountdown(data.countdown);
                }
            } catch (err) {
                console.error("Ошибка проверки статуса:", err);
                setGameStatus('waiting');
            }
        };

        // Первый запрос сразу при монтировании
        checkGameStatus();
        
        // Настраиваем интервал только если игра еще не начата
        if (gameStatus !== 'started') {
            pollingInterval.current = setInterval(checkGameStatus, 3000);
        }

        return () => {
            // Очищаем интервал при размонтировании
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        };
    }, [lobbyId, gameStatus]); // Добавляем gameStatus в зависимости

    // Остальной код остается без изменений
    if (gameStatus === 'checking') {
        return (
            <div className="waiting-screen">
                <div className="loader"></div>
                <p>Подключаемся к игре...</p>
            </div>
        );
    }

    if (gameStatus === 'waiting') {
        return (
            <div className="game-container">
                <div className="waiting-content">
                    <h2>Ожидание начала игры</h2>
                    <div className="players-status">
                        Готовы: {playersReady}/{totalPlayers} игроков
                    </div>
                    
                    {countdown && (
                        <div className="countdown">
                            Игра начнётся через: {countdown} сек.
                        </div>
                    )}
                                <div>
                <LeaveLobby />
            </div>
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

    return (
        <main className="game-container">
            <div>
                <LeaveLobby />
            </div>
            <div className="game-field">
                <div className="opponent-section">
                    <OpponentHand />
                    <div className="opponent-properties">
                        <CardProperty />
                    </div>
                </div>
                <div className="main-player-container">
                    <div>
                        <CardProperty />
                    </div>
                    <div className="main-player-deck">
                            <PlayerHand />
                        <div className="end-turn-button-container">
                        <EndTurn />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}