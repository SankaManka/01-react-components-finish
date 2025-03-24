import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth';
import { useNavigate } from 'react-router-dom';
import LobbyList from '../components/LobbyList';
import LogoutButton from '../components/LogoutBtn';
import '../index.css';
import RulesModal from '../components/RulesModal';

export default function LobbyPage() {
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  // Проверка авторизации при загрузке
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <main className='account-lobbie'>
      <div className='account-header'>
        <section>
          <h1 className="heading-account">EVOLUTION</h1>
          <h2 className="sub-heading-account">ЭВОЛЮЦИЯ</h2>
        </section>
        <div className="lobby-page-header">
          <LogoutButton />
        </div>
      </div>
      <div className="account-lobbies">
      <h4 className='lobby-heading'>Доступные лобби</h4>
        <div className="lobbies-container">
          <div className="lobbies">
            <LobbyList />
          </div>
        </div>
     </div>
      <footer style={{ position: 'fixed', bottom: '50px', width: '100%', paddingRight: '90px' }}>
            <RulesModal />
      </footer>
    </main>
  );
}