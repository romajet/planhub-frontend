import { Card, Col, Row, Statistic, Typography, Tag, Button } from 'antd';
import { BugOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import { AdminPortfolios } from './AdminPortfolios';
import { ManagerDashboard } from './ManagerDashboard';

const { Title, Text } = Typography;

// Мок-данные для задач сотрудника
const mockTasks = [
  { id: 'T-101', title: 'Обновить дизайн страницы профиля', priority: 'HIGH' },
  { id: 'T-102', title: 'Написать тесты для компонента Button', priority: 'MEDIUM' },
  { id: 'T-103', title: 'Исправить баг с модальным окном', priority: 'HIGH' },
];

// --- Компонент для Сотрудника / Менеджера ---
const StandardDashboard = () => {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Добро пожаловать в систему
        </Title>
        <Text type="secondary">Краткая сводка по вашим активностям на сегодня</Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card variant="borderless">
            <Statistic title="Активных задач" value={12} />
          </Card>
        </Col>
        <Col span={8}>
          <Card variant="borderless">
            <Statistic
              title="Задач на ревью"
              value={8}
              styles={{ content: { color: '#cf1322' } }}
              prefix={<BugOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card variant="borderless">
            <Statistic
              title="Закрыто за неделю"
              value={45}
              styles={{ content: { color: '#3f8600' } }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title="Мои задачи на сегодня" variant="borderless">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {mockTasks.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: index === mockTasks.length - 1 ? 'none' : '1px solid #f0f0f0',
                  }}
                >
                  <div>
                    <Text strong style={{ display: 'block', fontSize: 16 }}>
                      {item.title}
                    </Text>
                    <Tag color={item.priority === 'HIGH' ? 'red' : 'blue'} style={{ marginTop: 8 }}>
                      {item.priority === 'HIGH' ? 'Высокий приоритет' : 'Обычный'}
                    </Tag>
                  </div>
                  <Button type="link">Взять в работу</Button>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Ближайшие дедлайны" variant="borderless">
            <Text type="secondary">Список горящих дедлайнов</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// --- Умный роутер дашборда ---
export const Dashboard = () => {
  const { user } = useAuthStore();

  if (user?.role === 'ADMIN') return <AdminPortfolios />;
  if (user?.role === 'MANAGER') return <ManagerDashboard />;

  return <StandardDashboard />;
};
