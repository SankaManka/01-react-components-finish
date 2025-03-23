import React from 'react';

const LogoutButton = () => {
  // Функция для выхода из аккаунта
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'GET',
        credentials: 'include', // Если используется куки для аутентификации
      });

      if (response.ok) {
        // Перенаправляем пользователя на страницу входа или главную страницу
        window.location.href = '/login'; // Замените на нужный URL
      } else {
        console.error('Ошибка при выходе из аккаунта');
      }
    } catch (error) {
      console.error('Ошибка выхода из аккаунта:', error);
    }
  };

  return (
    <button onClick={handleLogout} className='create-lobby-btn'>
      Выйти из аккаунта
    </button>
  );
};

export default LogoutButton;