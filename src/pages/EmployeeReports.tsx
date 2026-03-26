import { Typography, Card, Row, Col, Statistic, Table, Tag, Space, Button, Progress } from 'antd';
import {
  ArrowUpOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LinkOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// --- Мок-данные для графика эффективности (за последние 7 дней) ---
const trendData = [
  { name: 'Пн', tasks: 2, hours: 6 },
  { name: 'Вт', tasks: 3, hours: 8 },
  { name: 'Ср', tasks: 1, hours: 4 },
  { name: 'Чт', tasks: 4, hours: 7 },
  { name: 'Пт', tasks: 2, hours: 5 },
  { name: 'Сб', tasks: 0, hours: 0 },
  { name: 'Вс', tasks: 0, hours: 0 },
];

// --- Мок-данные для истории отчетов ---
const reportsHistory = [
  {
    id: 'rep_1',
    date: dayjs().subtract(1, 'day').format('DD.MM.YYYY 18:30'),
    project: 'CRM для отдела продаж',
    task: 'Сверстать окно авторизации',
    status: 'ACCEPTED', // Принят
    link: 'https://github.com/company/crm/pull/12',
    comment: 'Реализовал форму, подключил Zustand. Все тесты зеленые.',
  },
  {
    id: 'rep_2',
    date: dayjs().subtract(2, 'day').format('DD.MM.YYYY 17:45'),
    project: 'CRM для отдела продаж',
    task: 'Настроить роутинг',
    status: 'REVIEW', // На проверке
    link: 'https://figma.com/file/...',
    comment: 'Добавил приватные маршруты и защиту страниц.',
  },
  {
    id: 'rep_3',
    date: dayjs().subtract(4, 'day').format('DD.MM.YYYY 19:00'),
    project: 'Интеграция складского API',
    task: 'Анализ документации 1С',
    status: 'ACCEPTED',
    link: '',
    comment: 'Документация изучена, составил схему маппинга полей (файл прикреплен).',
  },
];

export const EmployeeReports = () => {
  // Колонки для таблицы истории
  const columns = [
    {
      title: 'Дата и время',
      dataIndex: 'date',
      key: 'date',
      width: 150,
      render: (text: string) => <Text type="secondary">{text}</Text>,
    },
    {
      title: 'Проект / Задача',
      key: 'task',
      render: (record: any) => (
        <div>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
            {record.project}
          </Text>
          <Text strong>{record.task}</Text>
        </div>
      ),
    },
    {
      title: 'Комментарий',
      dataIndex: 'comment',
      key: 'comment',
      width: '35%',
    },
    {
      title: 'Материалы',
      key: 'link',
      render: (record: any) => (
        <Space>
          {record.link && (
            <Button
              type="link"
              size="small"
              icon={<LinkOutlined />}
              href={record.link}
              target="_blank"
            >
              Ссылка
            </Button>
          )}
          {!record.link && (
            <Button type="text" size="small" icon={<DownloadOutlined />}>
              Файл
            </Button>
          )}
        </Space>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      align: 'right' as const,
      render: (status: string) => {
        if (status === 'ACCEPTED')
          return (
            <Tag color="green" icon={<CheckCircleOutlined />}>
              Принят
            </Tag>
          );
        if (status === 'REVIEW')
          return (
            <Tag color="blue" icon={<ClockCircleOutlined />}>
              На проверке
            </Tag>
          );
        return <Tag>{status}</Tag>;
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Моя эффективность и отчеты
        </Title>
        <Text type="secondary">Аналитика вашей работы и история сданных задач</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* БЛОК 1: Карточки с KPI */}
        <Col span={8}>
          <Space orientation="vertical" style={{ width: '100%' }} size="middle">
            <Card variant="borderless">
              <Statistic
                title="Закрыто задач (за неделю)"
                value={12}
                styles={{ content: { color: '#3f8600' } }}
                prefix={<ArrowUpOutlined />}
                suffix={
                  <span style={{ fontSize: 14, color: '#8c8c8c', marginLeft: 8 }}>
                    +2 к прошлой неделе
                  </span>
                }
              />
            </Card>
            <Card variant="borderless">
              <Statistic title="Отработано часов (за неделю)" value={30} suffix="/ 40 ч." />
              <Progress
                percent={75}
                strokeColor="#1677ff"
                showInfo={false}
                style={{ marginTop: 8 }}
              />
            </Card>

            {/* --- НОВЫЙ БЛОК: Компетенции и ИИ --- */}
            <Card variant="borderless" title="🎯 Компетенции">
              <Space size={[0, 8]} wrap style={{ marginBottom: 16 }}>
                <Tag color="blue">Java (прод.)</Tag>
                <Tag color="cyan">Spring (ср.)</Tag>
                <Tag color="purple">SQL (ср.)</Tag>
                <Tag color="geekblue">Git (прод.)</Tag>
              </Space>

              <div
                style={{
                  padding: 12,
                  background: '#fffbe6',
                  borderRadius: 6,
                  border: '1px solid #ffe58f',
                }}
              >
                <Text strong style={{ color: '#d48806', display: 'block', marginBottom: 4 }}>
                  ⚡ ИИ-Рекомендация:
                </Text>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Для участия в следующем спринте проекта "Бета" вам будет полезно подтянуть{' '}
                  <b>Docker</b>. Изучите базовые концепции контейнеризации.
                </Text>
              </div>
            </Card>
          </Space>
        </Col>

        {/* БЛОК 2: График тренда */}
        <Col span={16}>
          <Card title="Тренд выполнения задач" variant="borderless" style={{ height: '100%' }}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  name="Задачи"
                  stroke="#1677ff"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="hours"
                  name="Часы"
                  stroke="#52c41a"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* БЛОК 3: Таблица истории отчетов */}
        <Col span={24}>
          <Card
            title="История отправленных отчетов"
            variant="borderless"
            styles={{ body: { padding: 0 } }}
          >
            <Table dataSource={reportsHistory} columns={columns} rowKey="id" pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
