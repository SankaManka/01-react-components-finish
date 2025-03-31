import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegistrationForm.module.css';
import { useAuthStore } from '../stores/auth';

export default function ChangePassword({ toggleForm }) {
  const [login, setLogin] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const loginUser = useAuthStore(state => state.login);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    // Валидация
    if (login.length < 4) {
      setError('Логин должен содержать минимум 4 символа');
      return;
    }
    if (!oldPassword) {
      setError('Введите старый пароль');
      return;
    }
    if (newPassword.length < 6) {
      setError('Новый пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      const response = await fetch('/api/change_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          login, 
          old_password: oldPassword, 
          new_password: newPassword 
        })
      });

      const data = await response.json();

      if (data.status === 'ok') {
        setSuccess('Пароль успешно изменён');
        loginUser({ login }); // Обновляем состояние пользователя, если необходимо
        // При необходимости можно перенаправить пользователя:
        // navigate('/lobby');
      } else {
        setError(data.msg || 'Ошибка смены пароля');
      }
    } catch (error) {
      setError('Ошибка сети: ' + error.message);
    }
  };

  return (
    <section className={styles.authSection}>
      <p className={styles.registerFormHeading}>Сменить пароль</p>
      {error && <p className={styles.errorText}>{error}</p>}
      {success && <p className={styles.successText}>{success}</p>}
      
      <form onSubmit={handleSubmit} className={styles.authForm}>
        {/* Логин */}
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

        {/* Старый пароль */}
        <div className={styles.inputGroup}>
          <input
            className={styles.inputLogin}
            type="password"
            value={oldPassword}
            placeholder="Старый пароль"
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        {/* Новый пароль */}
        <div className={styles.inputGroup}>
          <input
            className={styles.inputLogin}
            type="password"
            value={newPassword}
            placeholder="Новый пароль"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className={styles.registrationBtn}>
          Сменить пароль
        </button>
        
        <p className={styles.toggleFormText}>
          Вернуться к входу?{' '}
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
