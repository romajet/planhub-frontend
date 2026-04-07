import { Typography, Card, Row, Col, Table, Tag, Button, Progress, Statistic } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  LinkOutlined,
  DownloadOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const reportsHistory = [
  {
    id: 'r1',
    date: '15.05.2026',
    task: 'Сверстать окно авторизации',
    status: 'ACCEPTED',
    comment: 'Всё готово.',
    link: 'github.com',
  },
  {
    id: 'r2',
    date: '14.05.2026',
    task: 'Настроить роутинг',
    status: 'REVIEW',
    comment: 'Добавил защиту роутов.',
    link: '',
  },
];

export const EmployeeReports = () => {
  const columns = [
    { title: 'Дата', dataIndex: 'date', width: 120 },
    { title: 'Задача', dataIndex: 'task', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Комментарий', dataIndex: 'comment' },
    {
      title: 'Материалы',
      key: 'link',
      render: (r: any) =>
        r.link ? (
          <Button type="link" size="small" icon={<LinkOutlined />}>
            Ссылка
          </Button>
        ) : (
          <Button type="text" size="small" icon={<DownloadOutlined />}>
            Файл
          </Button>
        ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      align: 'right' as const,
      render: (s: string) => (
        <Tag
          color={s === 'ACCEPTED' ? 'green' : 'blue'}
          icon={s === 'ACCEPTED' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
        >
          {s === 'ACCEPTED' ? 'Принят' : 'На проверке'}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Отчет по проекту
        </Title>
        <Text type="secondary">Сводка по проекту и архив сданных отчетов</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Card title="Бюджет проекта" variant="borderless" style={{ height: '100%' }}>
            <Statistic value="1.5M ₽" suffix="/ 2.0M ₽" valueStyle={{ color: '#1677ff' }} />
            <Progress percent={75} strokeColor="#1677ff" style={{ marginTop: 16 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Прогресс задач" variant="borderless" style={{ height: '100%' }}>
            <Statistic value="32" suffix="/ 45 задач" valueStyle={{ color: '#52c41a' }} />
            <Progress percent={71} strokeColor="#52c41a" style={{ marginTop: 16 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Трудозатраты" variant="borderless" style={{ height: '100%' }}>
            <Statistic value="420 ч" suffix="/ 500 ч" valueStyle={{ color: '#faad14' }} />
            <Progress percent={84} strokeColor="#faad14" style={{ marginTop: 16 }} />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Архив отчетов" variant="borderless" styles={{ body: { padding: 0 } }}>
            <Table dataSource={reportsHistory} columns={columns} rowKey="id" pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
