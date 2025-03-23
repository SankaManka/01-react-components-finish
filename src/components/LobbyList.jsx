import { useState, useEffect } from 'react';
import Lobby from './Lobby';

// Компонент модального окна
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button onClick={onClose} className="close-modal-btn">Закрыть</button>
      </div>
    </div>
  );
};


// Основной компонент списка лобби
export default function LobbyList() {
  const [lobbies, setLobbies] = useState([]);
  const [password, setPassword] = useState(''); // Переименовано newLobbyName в password
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  // Функция для загрузки списка лобби
  const fetchLobbies = async () => {
    try {
      const response = await fetch('/api/lobbies');
      const data = await response.json();
      setLobbies(data);
    } catch (error) {
      console.error('Ошибка загрузки лобби:', error);
    }
  };

  // Функция для создания лобби
  const createLobby = async () => {
    if (password && selectedTime) {
      try {
        const response = await fetch('/api/lobbies/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            password: password, // Используем password вместо newLobbyName
            max_turn_time: selectedTime,
          }),
        });

        if (response.ok) {
          fetchLobbies();
          setPassword(''); // Очистка поля ввода пароля
          setSelectedTime(null);
          setIsModalOpen(false);
        } else {
          console.error('Ошибка при создании лобби');
        }
      } catch (error) {
        console.error('Ошибка создания лобби:', error);
      }
    } else {
      alert('Пожалуйста, заполните все поля.');
    }
  };

  // Загрузка лобби при монтировании компонента
  useEffect(() => {
    fetchLobbies();
    const interval = setInterval(fetchLobbies, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className='lobby-parent'>
      {/* Отображение списка лобби */}
      {lobbies.length > 0 ? (
        lobbies.map((lobby) => (
          <Lobby key={lobby.id_lobby} lobby={lobby} />
        ))
      ) : (
        <p>Лобби пока нет.</p>
      )}

      {/* Кнопка для открытия модального окна */}
      <div>
        <button onClick={() => setIsModalOpen(true)} className='create-lobby-btn'>Создать лобби</button>
      </div>

      {/* Модальное окно для создания лобби */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p className='p-heading'>Создать новое лобби</p>
        <div className='time-chose-container'>
          <p className='p'>Выберите время хода:</p>
          <div>
            <input
              type="radio"
              id="30"
              name="turnTime"
              value={30}
              checked={selectedTime === 30}
              onChange={() => setSelectedTime(30)}
            />
            <label htmlFor="30">30s</label>

            <input
              type="radio"
              id="60"
              name="turnTime"
              value={60}
              checked={selectedTime === 60}
              onChange={() => setSelectedTime(60)}
            />
            <label htmlFor="60">60s</label>

            <input
              type="radio"
              id="90"
              name="turnTime"
              value={90}
              checked={selectedTime === 90}
              onChange={() => setSelectedTime(90)}
            />
            <label htmlFor="90">90s</label>
          </div>
        </div>
        <p className='p'>Придумайте пароль для лобби:</p>
        <input
          type="password"
          value={password} // Используем password вместо newLobbyName
          onChange={(e) => setPassword(e.target.value)} // Обновляем setPassword
          placeholder="Пароль лобби"
          className='lobby-passwd-input'
        />
        <button onClick={createLobby} className='create-lobby-btn-modal'>Создать</button>
      </Modal>
    </section>
  );
}