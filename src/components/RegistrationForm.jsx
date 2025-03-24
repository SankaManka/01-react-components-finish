import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';
import styles from './RegistrationForm.module.css';

export default function Register({ toggleForm }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const loginUser = useAuthStore(state => state.login);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Валидация
    if (login.length < 4 || password.length < 6) {
      setError('Логин должен содержать ≥4 символов, пароль ≥6');
      return;
    }

    try {
      const response = await fetch('/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'ok') {
        loginUser({ login }); // Сохраняем только логин
        navigate('/lobby'); // Перенаправляем в лобби
      } else {
        setError(data.message || 'Ошибка регистрации');
      }
    } catch (error) {
      setError(error.message || 'Ошибка сети');
    }
  };

  return (
    <section className={styles.authSection}>
      <p className={styles.registerFormHeading}>Регистрация</p>
      {error && <p className={styles.errorText}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.inputGroup}>
          <input
            className={styles.inputLogin}
            type="text"
            value={login}
            placeholder="Придумайте логин"
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
            placeholder="Придумайте пароль"
            onChange={(e) => setPassword(e.target.value)}
            minLength="6"
            required
          />
        </div>

        <button type="submit" className={styles.registrationBtn}>
          Зарегистрироваться
        </button>

        <p className={styles.toggleFormText}>
          Есть аккаунт?{' '}
          <a 
            href="#" 
            className={styles.toggleFormLink} 
            onClick={(e) => {
              e.preventDefault();
              toggleForm();
            }}
          >
            Войти
          </a>
        </p>
      </form>
    </section>
  );
}