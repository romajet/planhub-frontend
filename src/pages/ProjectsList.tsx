import { useState, useMemo } from 'react';
import {
  Button,
  Table,
  Tag,
  Typography,
  Space,
  Dropdown,
  Progress,
  Card,
  Alert,
  Input,
  Select,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  RobotOutlined,
  FormOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const { Title } = Typography;

interface ProjectRecord {
  id: string;
  name: string;
  category: string; // Это наш "Портфель" из ER-диаграммы
  status: string;
  manager: string;
  progress: number;
  deadline: string;
}

export const ProjectsList = () => {
  const navigate = useNavigate();

  // Состояния фильтров
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [portfolioFilter, setPortfolioFilter] = useState<string | null>(null);

  const {
    data: projects = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      // Имитация ответа от бэкенда (с полем category/portfolio)
      return [
        {
          id: 'p_1',
          name: 'CRM для отдела продаж',
          category: 'Цифровая трансформация',
          status: 'ACTIVE',
          manager: 'Алексей Руководителев',
          progress: 75,
          deadline: '2026-08-01',
        },
        {
          id: 'p_2',
          name: 'Редизайн корпоративного сайта',
          category: 'Маркетинг и PR',
          status: 'DELAYED',
          manager: 'Мария Дизайнерова',
          progress: 30,
          deadline: '2026-05-15',
        },
        {
          id: 'p_3',
          name: 'Интеграция складского API',
          category: 'IT Инфраструктура',
          status: 'DRAFT',
          manager: 'Иван Иванов',
          progress: 0,
          deadline: '2026-12-01',
        },
        {
          id: 'p_4',
          name: 'Мобильное приложение iOS',
          category: 'Розничные продукты',
          status: 'ACTIVE',
          manager: 'Алексей Руководителев',
          progress: 45,
          deadline: '2026-10-20',
        },
      ] as ProjectRecord[];
    },
  });

  // Умная фильтрация данных
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.manager.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = statusFilter ? p.status === statusFilter : true;
      const matchPortfolio = portfolioFilter ? p.category === portfolioFilter : true;
      return matchSearch && matchStatus && matchPortfolio;
    });
  }, [projects, searchText, statusFilter, portfolioFilter]);

  // Уникальные портфели для селектора
  const uniquePortfolios = Array.from(new Set(projects.map((p) => p.category)));

  const createMenuItems: MenuProps['items'] = [
    {
      key: 'manual',
      icon: <FormOutlined />,
      label: 'Создать вручную',
      onClick: () => navigate('/projects/new'),
    },
    {
      key: 'ai-import',
      icon: <RobotOutlined style={{ color: '#1677ff' }} />,
      label: 'ИИ-Мастер переноса',
      onClick: () => navigate('/projects/import-ai'),
    },
  ];

  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <a style={{ fontWeight: 500 }} onClick={() => navigate('/board')}>
          {text}
        </a>
      ),
    },
    {
      title: 'Портфель',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => <Tag>{text}</Tag>,
    },
    { title: 'Руководитель', dataIndex: 'manager', key: 'manager' },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'ACTIVE') return <Tag color="green">В работе</Tag>;
        if (status === 'DELAYED') return <Tag color="red">Отстает</Tag>;
        return <Tag color="default">Черновик</Tag>;
      },
    },
    {
      title: 'Прогресс',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress percent={progress} size="small" style={{ minWidth: 120 }} />
      ),
    },
    { title: 'Дедлайн', dataIndex: 'deadline', key: 'deadline' },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, record: ProjectRecord) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/projects/${record.id}`)}
          >
            Открыть
          </Button>
          {record.status === 'DRAFT' && (
            <Button
              type="primary"
              ghost
              icon={<RobotOutlined />}
              onClick={() => navigate('/projects/ai-team-match')}
            >
              Собрать команду
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (isError) return <Alert title="Ошибка загрузки проектов" type="error" showIcon />;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Все проекты
        </Title>
        <Dropdown menu={{ items: createMenuItems }} placement="bottomRight" arrow>
          <Button type="primary" size="large" icon={<PlusOutlined />}>
            Создать проект
          </Button>
        </Dropdown>
      </div>

      {/* --- БЛОК ФИЛЬТРАЦИИ --- */}
      <Card
        variant="borderless"
        style={{ marginBottom: 24, background: '#f8fafd', borderColor: '#e0e9f2' }}
      >
        <Row gutter={16}>
          <Col span={10}>
            <Input
              placeholder="Поиск по названию или руководителю..."
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={7}>
            <Select
              placeholder="Фильтр по Портфелю"
              size="large"
              style={{ width: '100%' }}
              allowClear
              value={portfolioFilter}
              onChange={setPortfolioFilter}
              options={uniquePortfolios.map((p) => ({ value: p, label: p }))}
            />
          </Col>
          <Col span={7}>
            <Select
              placeholder="Фильтр по Статусу"
              size="large"
              style={{ width: '100%' }}
              allowClear
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'ACTIVE', label: 'В работе' },
                { value: 'DELAYED', label: 'Отстает' },
                { value: 'DRAFT', label: 'Черновик' },
              ]}
            />
          </Col>
        </Row>
      </Card>

      <Card variant="borderless" styles={{ body: { padding: 0 } }}>
        <Table
          dataSource={filteredProjects}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={isLoading}
        />
      </Card>
    </div>
  );
};
