import { useState } from 'react';
import styles from './RegistrationForm.module.css';

export default function Enter({ toggleForm }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (login.length >= 4 && password.length >= 6) {
      console.log('Логин:', login);
      console.log('Пароль:', password);

      // Редирект на страницу аккаунта после успешной регистрации
      window.location.href = '/account';
    } else {
      alert('Ошибка! Логин и пароль должны быть не менее 6 символов.');
    }
  };
  
  return (
    <section>
      <p className={styles.registerFormHeading}>Вход</p>
      <form onSubmit={handleSubmit} method="POST">
        <div>
          <label htmlFor="login"></label>
          <input
            className={styles.inputLogin}
            type="text"
            id="login"
            value={login}
            placeholder="login"
            onChange={(e) => setLogin(e.target.value)}
            minLength="6" maxLength="20" 
            pattern="^[a-zA-Z0-9]+$"
            required
          />
        </div>
        <div>
          <label htmlFor="password"></label>
          <input
            className={styles.inputLogin}
            type="password"
            id="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.registrationBtn}>Войти</button>
        <p>
          Нет аккаунта?{' '}
          <a href="" className={styles.enterLink} onClick={(e) => {e.preventDefault(); toggleForm();}}>Зарегистрироваться</a>
        </p>
      </form>
    </section>
  );
}