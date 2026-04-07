import { Card, Typography, Button, Table, Tag } from 'antd';
import { ExclamationCircleOutlined, RightOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import { ManagerDashboard } from './ManagerDashboard';
import { Navigate } from 'react-router-dom';
import { useUiStore } from '../store/uiStore';

const { Title, Text } = Typography;

const urgentTasks = [
  {
    id: 't_102',
    title: 'Исправить баг #4412 на проде',
    project: 'Альфа',
    deadline: 'Сегодня, 18:00',
  },
  { id: 't_105', title: 'Уязвимость в модуле оплат', project: 'Бета', deadline: 'Завтра, 12:00' },
];

const StandardDashboard = () => {
  const { openTaskDrawer } = useUiStore();

  const columns = [
    { title: 'Срочная задача', dataIndex: 'title', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Проект', dataIndex: 'project', render: (p: string) => <Tag color="blue">{p}</Tag> },
    {
      title: 'Дедлайн',
      dataIndex: 'deadline',
      render: (d: string) => <Text type="danger">{d}</Text>,
    },
    {
      title: '',
      key: 'action',
      align: 'right' as const,
      render: (r: any) => (
        <Button type="text" icon={<RightOutlined />} onClick={() => openTaskDrawer(r.id)} />
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Добро пожаловать в систему
        </Title>
        <Text type="secondary">Краткая сводка по вашим активностям на сегодня</Text>
      </div>

      <Card
        title={
          <>
            <ExclamationCircleOutlined style={{ color: '#cf1322' }} /> Требуют немедленного внимания
          </>
        }
        variant="borderless"
        style={{ border: '1px solid #ffccc7', background: '#fff2f0' }}
      >
        <Table
          dataSource={urgentTasks}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
};

export const Dashboard = () => {
  const { user } = useAuthStore();

  if (user?.role === 'ADMIN') return <Navigate to="/portfolio-reports" replace />;
  if (user?.role === 'MANAGER') return <ManagerDashboard />;

  return <StandardDashboard />;
};
