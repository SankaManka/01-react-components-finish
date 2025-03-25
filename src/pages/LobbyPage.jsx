import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth';
import { useNavigate } from 'react-router-dom';
import LobbyList from '../components/LobbyList';
import LogoutButton from '../components/LogoutBtn';
import '../index.css';
import RulesModal from '../components/RulesModal';

export default function LobbyPage() {
  const { user, isLoading, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Starting lobby auth check...');
    checkAuth().then(isAuthenticated => {
      console.log('Lobby auth check result:', isAuthenticated);
      if (!isAuthenticated) {
        console.log('Redirecting to auth page...');
        navigate('/');
      }
    });
  }, [checkAuth, navigate]);

  console.log('LobbyPage render, user:', user, 'isLoading:', isLoading);

  if (isLoading) return <div>Loading...</div>;
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