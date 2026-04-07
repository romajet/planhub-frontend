import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Функция запуска мок-сервера
async function enableMocking() {
  // Запускаем моки ТОЛЬКО в режиме разработки
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  const { worker } = await import('./mocks/browser');

  return worker.start({ 
    serviceWorker: {
      // Указываем точный путь к воркеру с учетом имени репозитория
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`
    },
    onUnhandledRequest: 'bypass' 
  });
}

// Сначала ждем запуска воркера, потом рендерим React
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
