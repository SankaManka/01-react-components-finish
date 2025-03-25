import { useState } from 'react';
import { useEffect } from 'react';
import Register from '../components/RegistrationForm';
import Enter from '../components/Enter';
import styles from '../components/RegistrationForm.module.css';
import RulesModal from '../components/RulesModal';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(true);
  const { isLoading, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Starting auth check...');
    checkAuth().then(isAuthenticated => {
      console.log('Auth check result:', isAuthenticated);
      if (isAuthenticated) {
        console.log('Redirecting to lobby...');
        navigate('/lobby');
      }
    });
  }, [checkAuth, navigate]);

  console.log('AuthPage render, isLoading:', isLoading);

  if (isLoading) return <div>Loading...</div>;
  return (
    <main className="main">
      <h1>EVOLUTION</h1>
      <h2>ЭВОЛЮЦИЯ</h2>
      <div className={styles.authContainer}>
        {isRegister ? (
          <Register toggleForm={() => setIsRegister(false)} />
        ) : (
          <Enter toggleForm={() => setIsRegister(true)} />
        )}
      </div>
      <footer style={{ position: 'fixed', bottom: '50px', width: '100%', paddingRight: '90px' }}>
            <RulesModal />
      </footer>
    </main>
  );
}