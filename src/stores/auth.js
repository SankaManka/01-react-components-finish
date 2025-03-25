import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  
  login: (userData) => set({ user: userData, isLoading: false }),
  
  logout: () => {
    fetch('/api/logout', { 
      method: 'POST',
      credentials: 'include'
    }).finally(() => {
      set({ user: null, isLoading: false });
    });
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch('/api/user_data', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      console.log('Received data:', data); // Для диагностики

      // Исправлено условие проверки
      if (data.status === 'ok' && data.user_id) {
        set({ 
          user: {
            id: data.user_id,
            login: data.login,
            password: data.password // Опасная практика!
          }, 
          isLoading: false 
        });
        return true;
      }
      throw new Error(data.msg || 'Not authenticated');
    } catch (error) {
      console.error('Auth check failed:', error);
      set({ user: null, isLoading: false });
      return false;
    }
  }
}));