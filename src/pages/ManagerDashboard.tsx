import { Typography, Card, Table, Tag, Progress, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const projectsData = [
  {
    key: '1',
    id: 'p_1',
    name: 'CRM для отдела продаж',
    progress: 82,
    status: 'В норме',
    deviation: '+2 дн',
    budget: '1.5M ₽ / 2.0M ₽',
  },
  {
    key: '2',
    id: 'p_2',
    name: 'Мобильное приложение',
    progress: 35,
    status: 'Отстает',
    deviation: '-5 дн',
    budget: '800k ₽ / 900k ₽',
  },
];

export const ManagerDashboard = () => {
  const navigate = useNavigate();

  const tableColumns = [
    {
      title: 'Проект',
      dataIndex: 'name',
      key: 'name',
      render: (t: string) => (
        <a style={{ fontWeight: 500, fontSize: 16 }} onClick={() => navigate('/board')}>
          {t}
        </a>
      ),
    },
    { title: 'Бюджет (Освоено / План)', dataIndex: 'budget', key: 'budget' },
    {
      title: 'Прогресс',
      dataIndex: 'progress',
      key: 'progress',
      render: (v: number) => <Progress percent={v} size="small" style={{ minWidth: 150 }} />,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => <Tag color={s === 'В норме' ? 'green' : 'orange'}>{s}</Tag>,
    },
    {
      title: 'Отклонение',
      dataIndex: 'deviation',
      key: 'deviation',
      render: (v: string) => <Text type={v.includes('-') ? 'danger' : 'success'}>{v}</Text>,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Сводная таблица проектов
        </Title>
        <Text type="secondary">Главная панель контроля проектов и статусов</Text>
      </div>

      <Card
        variant="borderless"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/projects/new')}>
            Создать проект
          </Button>
        }
      >
        <Table dataSource={projectsData} columns={tableColumns} pagination={false} />
      </Card>
    </div>
  );
};
