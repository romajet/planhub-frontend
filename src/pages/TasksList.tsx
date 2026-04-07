import { Typography, Row, Col, Card, Tag, Button } from 'antd';
import { ClockCircleOutlined, RightOutlined } from '@ant-design/icons';
import { useUiStore } from '../store/uiStore';

const { Title, Text } = Typography;

const newTasks = [
  {
    id: 't_106',
    title: 'Написать тесты для API',
    project: 'Альфа',
    priority: 'MEDIUM',
    deadline: '22.05.2026',
  },
  {
    id: 't_107',
    title: 'Оптимизировать запросы',
    project: 'Гамма',
    priority: 'LOW',
    deadline: '28.05.2026',
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
];

export const TasksList = () => {
  const { openTaskDrawer } = useUiStore();

  const renderTaskItem = (task: any) => (
    <Card
      size="small"
      hoverable
      style={{ marginBottom: 12, borderColor: '#e0e9f2' }}
      onClick={() => openTaskDrawer(task.id)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ marginBottom: 4 }}>
            <Tag
              color={
                task.priority === 'HIGH' ? 'red' : task.priority === 'MEDIUM' ? 'orange' : 'blue'
              }
            >
              {task.priority}
            </Tag>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {task.project}
            </Text>
          </div>
          <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 4 }}>
            {task.title}
          </Text>
          <Text type="secondary" style={{ fontSize: 13 }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} /> Дедлайн: {task.deadline}
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
        <Text type="secondary">Список задач, назначенных на вас</Text>
      </div>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <div
            style={{
              background: '#fafafa',
              padding: 20,
              borderRadius: 8,
              border: '1px solid #f0f0f0',
              minHeight: '65vh',
            }}
          >
            <Title level={4} style={{ marginTop: 0 }}>
              Новые (К выполнению)
            </Title>
            {newTasks.map((t) => renderTaskItem(t))}
          </div>
        </Col>
        <Col span={12}>
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
            {inProgressTasks.map((t) => renderTaskItem(t))}
          </div>
        </Col>
      </Row>
    </div>
  );
};
