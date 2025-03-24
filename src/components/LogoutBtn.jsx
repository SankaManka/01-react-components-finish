import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';

export default function LogoutButton() {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout');
      logout();
      navigate('/');
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  return (
    <button className='create-lobby-btn' onClick={handleLogout}>
      Выйти
    </button>
  );
}