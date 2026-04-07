import { useState, useMemo } from 'react';
import {
  Button,
  Table,
  Tag,
  Typography,
  Space,
  Progress,
  Card,
  Input,
  Select,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, FormOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

export const ProjectsList = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const projects = [
    {
      id: 'p_1',
      name: 'CRM для отдела продаж',
      status: 'ACTIVE',
      manager: 'Алексей Руководителев',
      progress: 75,
      deadline: '2026-08-01',
    },
    {
      id: 'p_2',
      name: 'Редизайн сайта',
      status: 'DELAYED',
      manager: 'Мария Дизайнерова',
      progress: 30,
      deadline: '2026-05-15',
    },
    {
      id: 'p_3',
      name: 'Интеграция API',
      status: 'DRAFT',
      manager: 'Иван Иванов',
      progress: 0,
      deadline: '2026-12-01',
    },
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.manager.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = statusFilter ? p.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [projects, searchText, statusFilter]);

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
    { title: 'Руководитель', dataIndex: 'manager', key: 'manager' },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : status === 'DELAYED' ? 'red' : 'default'}>
          {status === 'ACTIVE' ? 'В работе' : status === 'DELAYED' ? 'Отстает' : 'Черновик'}
        </Tag>
      ),
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
      render: (_: unknown, record: any) => (
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
              icon={<FormOutlined />}
              onClick={() => navigate('/projects/new')}
            >
              Продолжить настройку
            </Button>
          )}
        </Space>
      ),
    },
  ];

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
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate('/projects/new')}
        >
          Создать проект
        </Button>
      </div>

      <Card
        variant="borderless"
        style={{ marginBottom: 24, background: '#f8fafd', borderColor: '#e0e9f2' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Input
              placeholder="Поиск по названию или руководителю..."
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={8}>
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
        />
      </Card>
    </div>
  );
};
