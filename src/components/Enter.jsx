import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegistrationForm.module.css';
import { useAuthStore } from '../stores/auth';

export default function Enter({ toggleForm }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const loginUser = useAuthStore(state => state.login); // Получаем только нужный метод

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Валидация
    if (login.length < 4 || password.length < 6) {
      setError('Логин ≥4 символов, пароль ≥6');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      });

      const data = await response.json();

      if (data.status === 'ok') {
        loginUser({ login }); // Сохраняем только логин
        navigate('/lobby'); // Перенаправляем
      } else {
        setError(data.message || 'Ошибка входа');
      }
    } catch (error) {
      setError('Ошибка сети: ' + error.message);
    }
  };

  return (
    <section className={styles.authSection}>
      <p className={styles.registerFormHeading}>Вход</p>
      {error && <p className={styles.errorText}>{error}</p>}
      
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.inputGroup}>
          <input
            className={styles.inputLogin}
            type="text"
            value={login}
            placeholder="Логин"
            onChange={(e) => setLogin(e.target.value)}
            minLength="4"
            maxLength="20"
            pattern="^[a-zA-Z0-9]+$"
            required
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input
            className={styles.inputLogin}
            type="password"
            value={password}
            placeholder="Пароль"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className={styles.registrationBtn}>
          Войти
        </button>
        
        <p className={styles.toggleFormText}>
          Нет аккаунта?{' '}
          <a href="#" className={styles.toggleFormLink} onClick={(e) => {
            e.preventDefault();
            toggleForm();
          }}>
            Зарегистрироваться
          </a>
        </p>
      </form>
    </section>
  );
}