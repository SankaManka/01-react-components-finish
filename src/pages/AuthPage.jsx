import { useState } from 'react';
import Register from '../components/RegistrationForm';
import Enter from '../components/Enter';
import styles from '../components/RegistrationForm.module.css';
import RulesModal from '../components/RulesModal';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(true);

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