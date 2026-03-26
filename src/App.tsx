import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import './App.css';

// Создаем клиента React Query (здесь будут храниться закэшированные данные)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Отключаем авто-обновление при переключении вкладок браузера
      retry: 1, // Количество попыток при ошибке сети
    },
  },
});

function App() {
  return (
    // Оборачиваем приложение в провайдер
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
