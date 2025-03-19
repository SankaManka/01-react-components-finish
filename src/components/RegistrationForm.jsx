import { useState } from 'react';
import styles from './RegistrationForm.module.css'


export default function Register() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit = (event) => {
      event.preventDefault();
      // Здесь можно добавить логику для отправки данных на сервер
      console.log('Логин:', login);
      console.log('Пароль:', password);
    };
    return (
        <section>
            <p className={styles.registerFormHeading}>Регистрация</p>
            <form onSubmit={handleSubmit} method='POST'>
                <div>
                    <label htmlFor="login"></label>
                    <input
                    className={styles.inputLogin}
                    type="text"
                    id="login"
                    value={login}
                    placeholder='login'
                    onChange={(e) => setLogin(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password"></label>
                    <input className={styles.inputLogin}
                    type="password"
                    id="password"
                    value={password}
                    placeholder='password'
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className={styles.registrationBtn}>Зарегистрироваться</button>
                <p>Есть аккаунт?<a href="#" className={styles.enterLink}>Войти</a></p>
            </form>
        </section>
    )
}