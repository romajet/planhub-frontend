import { Typography, Card, Row, Col, Table, Tag, Button, Space, Statistic } from 'antd';
import {
  FilePdfOutlined,
  FileExcelOutlined,
  TeamOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const { Title, Text } = Typography;

const projectMetrics = [
  {
    key: '1',
    project: 'CRM для отдела продаж',
    income: 150,
    expense: 90,
    profit: 60,
    progress: 75,
    status: 'В норме',
  },
  {
    key: '2',
    project: 'Мобильное приложение',
    income: 300,
    expense: 320,
    profit: -20,
    progress: 35,
    status: 'Отстает',
  },
  {
    key: '3',
    project: 'Интеграция ERP',
    income: 80,
    expense: 50,
    profit: 30,
    progress: 95,
    status: 'В норме',
  },
  {
    key: '4',
    project: 'Редизайн сайта',
    income: 50,
    expense: 20,
    profit: 30,
    progress: 40,
    status: 'В норме',
  },
];

export const AdminReports = () => {
  const columns = [
    {
      title: 'Проект',
      dataIndex: 'project',
      key: 'project',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Доход',
      dataIndex: 'income',
      key: 'income',
      render: (val: number) => <Text>{val} млн ₽</Text>,
    },
    {
      title: 'Расход',
      dataIndex: 'expense',
      key: 'expense',
      render: (val: number) => <Text type={val > 150 ? 'danger' : 'secondary'}>{val} млн ₽</Text>,
    },
    {
      title: 'Прибыль',
      dataIndex: 'profit',
      key: 'profit',
      render: (val: number) => (
        <Text type={val < 0 ? 'danger' : 'success'} strong>
          {val} млн ₽
        </Text>
      ),
    },
    {
      title: 'Прогресс',
      dataIndex: 'progress',
      key: 'progress',
      render: (val: number) => <Text>{val}%</Text>,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'В норме' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Отчеты по проектам
          </Title>
          <Text type="secondary">Консолидированная финансовая аналитика всех проектов</Text>
        </div>
        <Space>
          <Button icon={<FileExcelOutlined />}>Экспорт в Excel</Button>
          <Button type="primary" icon={<FilePdfOutlined />}>
            Сформировать PDF
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {/* ВЕРХНИЕ МЕТРИКИ */}
        <Col span={6}>
          <Card variant="borderless">
            <Statistic title="Количество сотрудников" value={145} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless">
            <Statistic
              title="Общий доход"
              value="580M ₽"
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless">
            <Statistic
              title="Общий расход"
              value="480M ₽"
              prefix={<FallOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless">
            <Statistic
              title="Чистая прибыль"
              value="100M ₽"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>

        {/* ГИСТОГРАММА */}
        <Col span={24}>
          <Card title="Гистограмма финансов по проектам (млн ₽)" variant="borderless">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectMetrics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="project" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{ fill: '#f5f5f5' }} />
                <Legend />
                <Bar dataKey="income" name="Доход" fill="#52c41a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Расход" fill="#ff4d4f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* ТАБЛИЦА */}
        <Col span={24}>
          <Card title="Сводная таблица" variant="borderless" styles={{ body: { padding: 0 } }}>
            <Table dataSource={projectMetrics} columns={columns} pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
