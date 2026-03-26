import { Typography, Row, Col, Card, Tag, Button } from 'antd';
import { ClockCircleOutlined, ExclamationCircleOutlined, RightOutlined } from '@ant-design/icons';
import { useUiStore } from '../store/uiStore';

const { Title, Text } = Typography;

// Мок-данные из ER (таблица TASK)
const urgentTasks = [
  {
    id: 't_102',
    title: 'Исправить баг #4412 на проде',
    project: 'Альфа',
    priority: 'HIGH',
    deadline: 'Сегодня, 18:00',
  },
  {
    id: 't_105',
    title: 'Уязвимость в модуле оплат',
    project: 'Бета',
    priority: 'HIGH',
    deadline: 'Завтра, 12:00',
  },
];

const inProgressTasks = [
  {
    id: 't_101',
    title: 'Разработать модуль авторизации',
    project: 'Альфа',
    priority: 'MEDIUM',
    deadline: '17.05.2026',
  },
  {
    id: 't_103',
    title: 'Покрытие тестами API',
    project: 'Альфа',
    priority: 'MEDIUM',
    deadline: '19.05.2026',
  },
  {
    id: 't_104',
    title: 'Обновление UI компонентов',
    project: 'Гамма',
    priority: 'LOW',
    deadline: '25.05.2026',
  },
];

export const TasksList = () => {
  const { openTaskDrawer } = useUiStore();

  const renderTaskItem = (task: any, isUrgent = false) => (
    <Card
      size="small"
      hoverable
      style={{ marginBottom: 12, borderColor: isUrgent ? '#ffccc7' : '#e0e9f2' }}
      onClick={() => openTaskDrawer(task.id)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ marginBottom: 4 }}>
            <Tag color={isUrgent ? 'red' : task.priority === 'MEDIUM' ? 'orange' : 'blue'}>
              {isUrgent ? 'Критично' : task.priority === 'MEDIUM' ? 'Средний' : 'Низкий'}
            </Tag>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {task.project}
            </Text>
          </div>
          <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 4 }}>
            {task.title}
          </Text>
          <Text type={isUrgent ? 'danger' : 'secondary'} style={{ fontSize: 13 }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            Дедлайн: {task.deadline}
          </Text>
        </div>
        <Button type="text" icon={<RightOutlined />} />
      </div>
    </Card>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Мои задачи
        </Title>
        <Text type="secondary">Список задач, назначенных на вас (assignee_user_id)</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Срочные задачи */}
        <Col span={10}>
          <div
            style={{
              background: '#fff2f0',
              padding: 20,
              borderRadius: 8,
              border: '1px solid #ffccc7',
              minHeight: '65vh',
            }}
          >
            <Title
              level={4}
              style={{
                color: '#cf1322',
                marginTop: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <ExclamationCircleOutlined /> Срочно / Новые
            </Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              Требуют немедленного внимания (SLA &lt; 24ч)
            </Text>

            {urgentTasks.map((t) => renderTaskItem(t, true))}
          </div>
        </Col>

        {/* Задачи в работе */}
        <Col span={14}>
          <div
            style={{
              background: '#f8fafd',
              padding: 20,
              borderRadius: 8,
              border: '1px solid #e0e9f2',
              minHeight: '65vh',
            }}
          >
            <Title level={4} style={{ color: '#1e3a5f', marginTop: 0 }}>
              В работе
            </Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              Ваши текущие задачи по проектам
            </Text>

            {inProgressTasks.map((t) => renderTaskItem(t, false))}
          </div>
        </Col>
      </Row>
    </div>
  );
};
