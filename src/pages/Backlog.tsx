import { Typography, Table, Tag, Button, Card, Space } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';
import { useUiStore } from '../store/uiStore';

const { Title, Text } = Typography;

// Мок-данные из таблицы TASK
const mockTasks = [
  {
    id: 't_1',
    title: 'Спроектировать API',
    status: 'TODO',
    priority: 'HIGH',
    assignee: 'Иван Иванов',
  },
  {
    id: 't_2',
    title: 'Настроить CI/CD',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    assignee: 'Анна Смирнова',
  },
  {
    id: 't_3',
    title: 'Сверстать модалки',
    status: 'REVIEW',
    priority: 'LOW',
    assignee: 'Пётр Иванов',
  },
];

export const Backlog = () => {
  const { type } = useParams<{ type: string }>(); // Получаем 'all', 'progress' или 'review' из URL
  const { openTaskDrawer } = useUiStore();

  // Фильтруем задачи в зависимости от подпункта меню
  const filteredTasks = mockTasks.filter((task) => {
    if (type === 'progress') return task.status === 'IN_PROGRESS';
    if (type === 'review') return task.status === 'REVIEW';
    return true; // 'all'
  });

  const getPageTitle = () => {
    if (type === 'progress') return 'Задачи в работе';
    if (type === 'review') return 'Задачи на проверке (Ревью)';
    return 'Весь Бэклог';
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <Text type="secondary">{text}</Text>,
    },
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    { title: 'Исполнитель', dataIndex: 'assignee', key: 'assignee' },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'TODO' ? 'default' : status === 'IN_PROGRESS' ? 'blue' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      align: 'right' as const,
      render: (record: any) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => openTaskDrawer(record.id)}>
          Открыть
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          {getPageTitle()}
        </Title>
        <Text type="secondary">Управление пулом задач (Таблица TASK)</Text>
      </div>
      <Card variant="borderless" styles={{ body: { padding: 0 } }}>
        <Table
          dataSource={filteredTasks}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 15 }}
        />
      </Card>
    </div>
  );
};
