import { Typography, Row, Col, Card, Progress, Space, Avatar, List, Statistic } from 'antd';
import {
  UserOutlined,
  DollarOutlined,
  AimOutlined,
  TeamOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const { Title, Text } = Typography;

// --- Мок-данные для виджетов ---

// 1. Загрузка команды (Фамилия И.О. - текущие задачи - норма)
const teamWorkload = [
  {
    id: '1',
    name: 'Иванов И.И.',
    role: 'Frontend',
    current: 12,
    max: 15,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
  },
  {
    id: '2',
    name: 'Смирнова А.П.',
    role: 'Backend',
    current: 18,
    max: 15,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
  }, // Перегруз
  {
    id: '3',
    name: 'Дёмина Е.В.',
    role: 'QA',
    current: 6,
    max: 10,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
  },
  {
    id: '4',
    name: 'Петров П.С.',
    role: 'DevOps',
    current: 8,
    max: 8,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Petr',
  },
];

// 2. Скорость команды (Story Points по спринтам)
const velocityData = [
  { sprint: 'Спринт 1', planned: 40, completed: 35 },
  { sprint: 'Спринт 2', planned: 45, completed: 45 },
  { sprint: 'Спринт 3', planned: 50, completed: 42 },
  { sprint: 'Спринт 4', planned: 40, completed: 55 }, // Перевыполнили
  { sprint: 'Спринт 5', planned: 55, completed: 0 }, // Текущий
];

// 3. Стратегические цели
const strategicGoals = [
  { id: 'g1', title: 'Релиз MVP клиентского портала', progress: 85 },
  { id: 'g2', title: 'Миграция БД на PostgreSQL', progress: 40 },
  { id: 'g3', title: 'Покрытие API автотестами (80%)', progress: 60 },
];

export const ManagerDashboard = () => {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Сводка руководителя
        </Title>
        <Text type="secondary">Глобальные показатели ваших команд и проектов</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* ВИДЖЕТ 1: Загрузка команды */}
        <Col span={12}>
          <Card
            title={
              <>
                <TeamOutlined /> Загрузка команды
              </>
            }
            variant="borderless"
            style={{ height: '100%' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={teamWorkload}
              renderItem={(member) => {
                const percent = Math.round((member.current / member.max) * 100);
                const isOverloaded = percent > 100;
                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={member.avatar} icon={<UserOutlined />} />}
                      title={<Text strong>{member.name}</Text>}
                      description={<Text type="secondary">{member.role}</Text>}
                    />
                    <div style={{ width: 180 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: 4,
                          fontSize: 12,
                        }}
                      >
                        <Text type={isOverloaded ? 'danger' : 'secondary'}>
                          {member.current} задач
                        </Text>
                        <Text type="secondary">Норма: {member.max}</Text>
                      </div>
                      <Progress
                        percent={percent > 100 ? 100 : percent}
                        showInfo={false}
                        status={isOverloaded ? 'exception' : 'active'}
                        strokeColor={isOverloaded ? undefined : '#1677ff'}
                      />
                    </div>
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>

        {/* ВИДЖЕТ 2: Скорость команды (Velocity) */}
        <Col span={12}>
          <Card
            title={
              <>
                <RocketOutlined /> Скорость команды (Story Points)
              </>
            }
            variant="borderless"
            style={{ height: '100%' }}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={velocityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="sprint" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{ fill: '#f5f5f5' }} />
                <Legend />
                <Bar
                  dataKey="planned"
                  name="Запланировано (SP)"
                  fill="#d9d9d9"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="completed"
                  name="Выполнено (SP)"
                  fill="#1677ff"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* ВИДЖЕТ 3: Бюджет проектов */}
        <Col span={10}>
          <Card
            title={
              <>
                <DollarOutlined /> Сводный бюджет
              </>
            }
            variant="borderless"
            style={{ height: '100%' }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%', marginTop: 16 }}>
              <div>
                <Text type="secondary">Запланировано на квартал</Text>
                <Title level={3} style={{ margin: 0 }}>
                  4 500 000 ₽
                </Title>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>Текущие затраты</Text>
                  <Text strong type="danger">
                    2 850 000 ₽
                  </Text>
                </div>
                <Progress percent={63} strokeColor="#ff4d4f" />
              </div>

              <Row gutter={16}>
                <Col span={12}>
                  <Statistic title="Использовано чел/час" value={1420} suffix="/ 2000" />
                </Col>
                <Col span={12}>
                  <Statistic title="ФОТ" value="1.8M ₽" />
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>

        {/* ВИДЖЕТ 4: Стратегические цели */}
        <Col span={14}>
          <Card
            title={
              <>
                <AimOutlined /> Стратегические цели (OKR)
              </>
            }
            variant="borderless"
            style={{ height: '100%' }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {strategicGoals.map((goal) => (
                <div key={goal.id}>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}
                  >
                    <Text strong>{goal.title}</Text>
                    <Text type="secondary">{goal.progress}%</Text>
                  </div>
                  <Progress percent={goal.progress} strokeColor="#52c41a" />
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
