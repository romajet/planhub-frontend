import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const ProtectedRoute = () => {
  // Достаем статус авторизации из нашего Zustand-хранилища
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Если не авторизован — редирект на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Если все ок — рендерим дочерние компоненты (наш Layout и страницы)
  return <Outlet />;
};
