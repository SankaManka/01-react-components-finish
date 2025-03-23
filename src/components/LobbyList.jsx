import { useState, useEffect } from 'react';

const Lobby = ({ lobby }) => {
  const { creator, max_turn_time, players, max_players } = lobby;

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
        <button className='join-btn'>Присоединиться</button>
      </div>
    </div>
  );
};

export default function LobbyList() {
  const [lobbies, setLobbies] = useState([]);
  const [newLobbyName, setNewLobbyName] = useState('');

  const fetchLobbies = async () => {
    try {
      const response = await fetch('/api/lobbies');
      const data = await response.json();
      setLobbies(data);
    } catch (error) {
      console.error('Ошибка загрузки лобби:', error);
    }
  };

  const createLobby = async () => {
    if (newLobbyName) {
      try {
        const response = await fetch('/api/lobbies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newLobbyName }),
        });

        if (response.ok) {
          fetchLobbies(); // Перезагружаем список лобби
          setNewLobbyName(''); // Очистка поля ввода
        } else {
          console.error('Ошибка при создании лобби');
        }
      } catch (error) {
        console.error('Ошибка создания лобби:', error);
      }
    }
  };

  useEffect(() => {
    fetchLobbies();
    const interval = setInterval(fetchLobbies, 5000); // Обновление лобби каждые 5 секунд
    return () => clearInterval(interval); // Очистка интервала при размонтировании
  }, []);

  return (
    <section className='lobby-parent'>
      {lobbies.length > 0 ? (
        lobbies.map((lobby) => (
          <Lobby key={lobby.id} lobby={lobby} />
        ))
      ) : (
        <p>Лобби пока нет.</p>
      )}

      {/* Добавление нового лобби */}
      <div>
        <button onClick={createLobby} className='create-lobby-btn'>Создать лобби</button>
      </div>
    </section>
  );
}
