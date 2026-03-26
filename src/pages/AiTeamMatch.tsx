import { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Table,
  Tag,
  Progress,
  Button,
  Space,
  Spin,
  Alert,
  Row,
  Col,
  Avatar,
} from 'antd';
import {
  UserAddOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

// --- Мок-данные: Потребности проекта (из предыдущего шага) ---
const projectRoles = [
  { id: 'r1', role: 'Frontend Разработчик', skills: ['React', 'TypeScript', 'Zustand'] },
  { id: 'r2', role: 'Backend Разработчик', skills: ['Python', 'FastAPI', 'PostgreSQL'] },
];

// --- Мок-данные: Рекомендации ИИ (после анализа) ---
const recommendedCandidates = [
  {
    id: 'u1',
    name: 'Иван Иванов',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
    role: 'Frontend Разработчик',
    matchScore: 98,
    workload: 40, // Текущая загрузка в %
    skills: ['React', 'TypeScript', 'Zustand', 'Ant Design'],
    conflict: false,
  },
  {
    id: 'u2',
    name: 'Анна Смирнова',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
    role: 'Backend Разработчик',
    matchScore: 85,
    workload: 90, // Высокая загрузка!
    skills: ['Python', 'Django', 'FastAPI'],
    conflict: true, // ИИ подсвечивает конфликт загрузки
  },
  {
    id: 'u3',
    name: 'Петр Петров',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Petr',
    role: 'Backend Разработчик',
    matchScore: 92,
    workload: 15,
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    conflict: false,
  },
];

export const AiTeamMatch = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Имитируем процесс работы ИИ (сбор компетенций, расчет рейтинга)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
    }, 2500); // 2.5 секунды "думаем" для красивого UX
    return () => clearTimeout(timer);
  }, []);

  const handleApproveTeam = () => {
    // В реальном приложении здесь был бы POST запрос на бэк
    navigate('/projects'); // Возвращаемся в список проектов
  };

  const columns = [
    {
      title: 'Кандидат',
      dataIndex: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Avatar src={record.avatar} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      render: (role: string) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: 'Компетенции',
      dataIndex: 'skills',
      render: (skills: string[]) => (
        <Space size={[0, 4]} wrap>
          {skills.map((skill) => (
            <Tag key={skill}>{skill}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Рейтинг ИИ',
      dataIndex: 'matchScore',
      render: (score: number) => (
        <Space>
          <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
          <Text strong style={{ color: '#52c41a' }}>
            {score}%
          </Text>
        </Space>
      ),
      sorter: (a: any, b: any) => a.matchScore - b.matchScore,
    },
    {
      title: 'Текущая загрузка',
      dataIndex: 'workload',
      render: (workload: number, record: any) => (
        <Space orientation="vertical" style={{ width: '100%' }}>
          <Progress
            percent={workload}
            size="small"
            status={record.conflict ? 'exception' : 'active'}
            strokeColor={workload > 80 ? '#ff4d4f' : '#1677ff'}
          />
          {record.conflict && (
            <Text type="danger" style={{ fontSize: 12 }}>
              <WarningOutlined /> Конфликт загрузки
            </Text>
          )}
        </Space>
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
          alignItems: 'flex-start',
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Умный подбор команды
          </Title>
          <Text type="secondary">ИИ анализирует компетенции и конфликты загрузки</Text>
        </div>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          size="large"
          disabled={isAnalyzing || selectedRowKeys.length === 0}
          onClick={handleApproveTeam}
        >
          Утвердить состав ({selectedRowKeys.length})
        </Button>
      </div>

      {isAnalyzing ? (
        <Card style={{ textAlign: 'center', padding: '100px 0' }}>
          <Space orientation="vertical" size="large">
            <Spin size="large" />
            <Title level={4}>ИИ анализирует базу сотрудников...</Title>
            <Text type="secondary">
              Сбор данных о компетенциях • Расчет рейтинга • Проверка конфликтов
            </Text>
          </Space>
        </Card>
      ) : (
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <Alert
            title="Анализ завершен"
            description="Система подобрала оптимальных кандидатов на основе требуемых ролей и текущей загрузки. Выберите сотрудников для добавления в проект."
            type="success"
            showIcon
            icon={<RobotOutlined />}
          />

          <Row gutter={16}>
            <Col span={6}>
              <Card title="Требуемые роли" size="small">
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  {projectRoles.map((r) => (
                    <li key={r.id} style={{ marginBottom: 8 }}>
                      <Text strong>{r.role}</Text>
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>
            <Col span={18}>
              <Card title="Рекомендованные кандидаты" styles={{ body: { padding: 0 } }}>
                <Table
                  rowSelection={{
                    selectedRowKeys,
                    onChange: (keys) => setSelectedRowKeys(keys),
                    // Не даем выбрать перегруженных сотрудников по умолчанию (но можно убрать это ограничение)
                    getCheckboxProps: (record: any) => ({
                      name: record.name,
                    }),
                  }}
                  columns={columns}
                  dataSource={recommendedCandidates}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </Space>
      )}
    </div>
  );
};
