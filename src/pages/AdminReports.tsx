import { Typography, Card, Row, Col, Table, Tag, Button, Space, message } from 'antd';
import { FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';
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

// Мок-данные для таблицы и графика
const portfolioMetrics = [
  {
    key: '1',
    portfolio: 'Цифровая трансформация',
    budgetTotal: 150, // в миллионах
    budgetSpent: 67.5,
    progress: 35,
    roi: '+12%',
    risk: 'LOW',
  },
  {
    key: '2',
    portfolio: 'Розничные продукты',
    budgetTotal: 300,
    budgetSpent: 255,
    progress: 60,
    roi: '+5%',
    risk: 'HIGH',
  },
  {
    key: '3',
    portfolio: 'IT Инфраструктура',
    budgetTotal: 80,
    budgetSpent: 72,
    progress: 95,
    roi: '+18%',
    risk: 'LOW',
  },
  {
    key: '4',
    portfolio: 'Маркетинг и PR',
    budgetTotal: 50,
    budgetSpent: 20,
    progress: 40,
    roi: '0%',
    risk: 'MEDIUM',
  },
];

export const AdminReports = () => {
  // Имитация экспорта
  const handleExport = (format: string) => {
    message.loading({ content: `Генерация ${format} отчета...`, key: 'export' });
    setTimeout(() => {
      message.success({
        content: `Отчет успешно скачан в формате ${format}!`,
        key: 'export',
        duration: 3,
      });
    }, 1500);
  };

  const columns = [
    {
      title: 'Название портфеля',
      dataIndex: 'portfolio',
      key: 'portfolio',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Общий бюджет',
      dataIndex: 'budgetTotal',
      key: 'budgetTotal',
      render: (val: number) => <Text>{val} млн ₽</Text>,
    },
    {
      title: 'Освоено средств',
      dataIndex: 'budgetSpent',
      key: 'budgetSpent',
      render: (val: number, record: any) => {
        const percent = Math.round((val / record.budgetTotal) * 100);
        // Подсвечиваем красным, если потрачено больше 80% бюджета
        const color = percent > 80 ? '#cf1322' : 'inherit';
        return (
          <Text style={{ color }}>
            {val} млн ₽ ({percent}%)
          </Text>
        );
      },
    },
    {
      title: 'Прогресс',
      dataIndex: 'progress',
      key: 'progress',
      render: (val: number) => <Text>{val}%</Text>,
    },
    {
      title: 'Прогноз ROI',
      dataIndex: 'roi',
      key: 'roi',
      render: (text: string) => (
        <Tag color="green" style={{ fontSize: 14, padding: '2px 8px' }}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Уровень риска',
      dataIndex: 'risk',
      key: 'risk',
      render: (risk: string) => {
        let color = 'blue';
        let text = risk;
        if (risk === 'LOW') {
          color = 'green';
          text = 'Низкий';
        }
        if (risk === 'MEDIUM') {
          color = 'orange';
          text = 'Средний';
        }
        if (risk === 'HIGH') {
          color = 'red';
          text = 'Высокий';
        }
        return <Tag color={color}>{text}</Tag>;
      },
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
            Отчеты по портфелям
          </Title>
          <Text type="secondary">Консолидированная финансовая и управленческая аналитика</Text>
        </div>
        <Space>
          <Button icon={<FileExcelOutlined />} onClick={() => handleExport('Excel')}>
            Экспорт в Excel
          </Button>
          <Button type="primary" icon={<FilePdfOutlined />} onClick={() => handleExport('PDF')}>
            Сформировать PDF
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {/* График бюджетов */}
        <Col span={24}>
          <Card title="Сравнение: Общий бюджет vs Освоено (млн ₽)" variant="borderless">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={portfolioMetrics}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="portfolio" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{ fill: '#f5f5f5' }} />
                <Legend />
                <Bar
                  dataKey="budgetTotal"
                  name="Выделенный бюджет"
                  fill="#1677ff"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="budgetSpent"
                  name="Освоено средств"
                  fill="#ff4d4f"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Сводная таблица */}
        <Col span={24}>
          <Card variant="borderless" styles={{ body: { padding: 0 } }}>
            <Table dataSource={portfolioMetrics} columns={columns} pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
