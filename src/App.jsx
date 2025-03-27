import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/game/:lobby_id/:player_id" element={<GamePage />} />
        </Routes>
    </BrowserRouter>
  );
}