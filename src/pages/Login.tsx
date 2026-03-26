import { Button, Card, Form, Input, Typography, message, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { User } from '../types/user';

const { Title, Text } = Typography;

// Тип ответа от нашего "сервера"
interface LoginResponse {
  user: User;
  token: string;
}

export const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // Настраиваем мутацию (POST запрос на сервер)
  const mutation = useMutation({
    mutationFn: async (credentials: any) => {
      // Отправляем email и пароль на наш мок-сервер
      const response = await axios.post<LoginResponse>('/api/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // 1. Сохраняем токен (в реальном приложении он нужен для следующих запросов)
      localStorage.setItem('token', data.token);

      // 2. Сохраняем пользователя в Zustand
      login(data.user);

      message.success(`Добро пожаловать, ${data.user.fullName}!`);

      // 3. Перекидываем в личный кабинет
      navigate('/');
    },
    onError: () => {
      message.error('Неверный email или пароль');
    },
  });

  // Эта функция сработает, когда форма пройдет локальную валидацию (email не пустой и т.д.)
  const onFinish = (values: any) => {
    // Запускаем отправку данных на сервер
    mutation.mutate(values);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 8 }}>
          Вход в систему
        </Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
          AI Project Management
        </Text>

        {/* Если сервер вернул ошибку, показываем красную плашку */}
        {mutation.isError && (
          <Alert
            title="Ошибка авторизации. Попробуйте снова."
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ email: 'manager@example.com', password: 'password123' }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Пожалуйста, введите email!' },
              { type: 'email', message: 'Введите корректный email!' },
            ]}
          >
            <Input size="large" placeholder="mail@example.com" disabled={mutation.isPending} />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
          >
            <Input.Password size="large" placeholder="••••••••" disabled={mutation.isPending} />
          </Form.Item>

          <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={mutation.isPending} // Крутилка при загрузке
            >
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
