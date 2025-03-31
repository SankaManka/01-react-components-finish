import { useState, useEffect } from 'react';
import Register from '../components/RegistrationForm';
import Enter from '../components/Enter';
import ChangePassword from '../components/ChangePassword'; // Импорт компонента смены пароля
import styles from '../components/RegistrationForm.module.css';
import RulesModal from '../components/RulesModal';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';

export default function AuthPage() {
  // Возможные значения: 'register', 'enter', 'changePassword'
  const [formType, setFormType] = useState('register');
  const { isLoading, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then(isAuthenticated => {
      if (isAuthenticated) {
        navigate('/lobby');
      }
    });
  }, [checkAuth, navigate]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <main className="main">
      <h1>EVOLUTION</h1>
      <h2>ЭВОЛЮЦИЯ</h2>
      <div className={styles.authContainer}>
        {formType === 'register' && (
          <Register toggleForm={() => setFormType('enter')} />
        )}
        {formType === 'enter' && (
          <Enter toggleForm={() => setFormType('register')} />
        )}
        {formType === 'changePassword' && (
          <ChangePassword toggleForm={() => setFormType('enter')} />
        )}
      </div>
      {formType === 'enter' && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          {/* При клике переключаем на форму смены пароля */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setFormType('changePassword');
            }}
          >
            Сменить пароль
          </a>
        </div>
      )}
      <footer
        style={{
          position: 'fixed',
          bottom: '50px',
          width: '100%',
          paddingRight: '90px'
        }}
      >
        <RulesModal />
      </footer>
    </main>
  );
}
