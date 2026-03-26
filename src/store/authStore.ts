import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // <-- Импортируем persist
import type { User, Role } from '../types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  currentProjectId: string | null;
  login: (userData: User) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
  setCurrentProjectId: (projectId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      currentProjectId: 'p_1',

      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => {
        localStorage.removeItem('token'); // Заодно чистим токен
        set({ user: null, isAuthenticated: false });
      },
      switchRole: (role) =>
        set((state) => ({
          user: state.user ? { ...state.user, role } : null,
        })),
      setCurrentProjectId: (projectId) => set({ currentProjectId: projectId }),
    }),
    {
      name: 'planhub-auth-storage', // Имя ключа в localStorage
    },
  ),
);
