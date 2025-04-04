import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import RulesModal from './components/RulesModal';
import LobbyList from './components/LobbyList';
import LogoutButton from './components/LogoutBtn';

// Рендер списка лобби
const lobbiesContainer = document.getElementById('lobbiesContainer');
if (lobbiesContainer) {
  ReactDOM.createRoot(lobbiesContainer).render(<LobbyList />);
}

// Рендер модального окна в footer (если элемент существует)
const footer = document.getElementById('footer');
if (footer) {
  ReactDOM.createRoot(footer).render(<RulesModal />);
}

// Рендер кнопки выхода
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
  ReactDOM.createRoot(logoutButton).render(<LogoutButton />);
}