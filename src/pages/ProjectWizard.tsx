import { useState } from 'react';
import {
  Steps,
  Button,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Table,
  Tag,
  Modal,
  message,
  Avatar,
  InputNumber,
  Popconfirm,
} from 'antd';
import {
  ProjectOutlined,
  RobotOutlined,
  NodeIndexOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

// --- МОК-ДАННЫЕ ---
const aiTemplates = [
  {
    id: 'tpl_1',
    title: 'Корпоративный портал (Agile)',
    match: 95,
    desc: 'На основе прошлого проекта "Внутренняя CRM". Включает 4 стадии и 12 базовых задач.',
  },
  {
    id: 'tpl_2',
    title: 'Интернет-магазин (Waterfall)',
    match: 78,
    desc: 'Стандартный e-commerce пакет. Строгая последовательность этапов.',
  },
  {
    id: 'tpl_3',
    title: 'Интеграция 1С',
    match: 60,
    desc: 'Шаблон для интеграционных проектов (API, шлюзы).',
  },
];

const mockCandidates = [
  {
    id: 'u1',
    name: 'Иван Иванов',
    role: 'Backend Разработчик',
    match: 98,
    workload: 40,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
    skills: ['Python', 'PostgreSQL'],
  },
  {
    id: 'u2',
    name: 'Анна Смирнова',
    role: 'Frontend Разработчик',
    match: 92,
    workload: 35,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
    skills: ['React', 'TypeScript'],
  },
];

// Интерфейсы для Этапов и Задач
interface TaskType {
  id: string;
  name: string;
  description: string;
  days: number;
  hours: number;
}
interface StageType {
  id: string;
  name: string;
  description: string;
  tasks: TaskType[];
}

export const ProjectWizard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [formBasic] = Form.useForm();

  // Стейты Шаг 2 (Шаблоны)
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Стейты Шаг 3 (WorkFlow)
  const [workflowStages] = useState(['To Do', 'In Progress', 'Review', 'Done']);

  // Стейты Шаг 4 (Этапы и Задачи)
  const [stages, setStages] = useState<StageType[]>([
    {
      id: 's1',
      name: 'Аналитика',
      description: 'Сбор требований и проектирование БД',
      tasks: [
        {
          id: 't1',
          name: 'Проектирование БД',
          description: 'Схема в dbdiagram',
          days: 5,
          hours: 40,
        },
      ],
    },
  ]);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [stageForm] = Form.useForm();
  const [taskForm] = Form.useForm();

  // Стейты Шаг 5 (Команда)
  const [teamSearch, setTeamSearch] = useState('');
  const [team, setTeam] = useState<any[]>([]);
  const [isScoring, setIsScoring] = useState(false);

  // --- НАВИГАЦИЯ ---
  const next = async () => {
    if (currentStep === 0) {
      try {
        await formBasic.validateFields();
        setCurrentStep(currentStep + 1);
      } catch (error) {
        message.error('Пожалуйста, заполните обязательные поля');
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };
  const prev = () => setCurrentStep(currentStep - 1);

  const handleExit = () => {
    Modal.confirm({
      title: 'Сохранить черновик?',
      content: 'Вы хотите сохранить введенные данные перед выходом?',
      okText: 'Да, сохранить',
      cancelText: 'Нет, выйти',
      onOk: () => {
        message.success('Черновик сохранен!');
        navigate('/projects');
      },
      onCancel: () => navigate('/projects'),
    });
  };

  const handleFinish = () => {
    message.success('Проект успешно создан и запущен в работу!');
    navigate('/projects');
  };

  // --- ЛОГИКА ЭТАПОВ И ЗАДАЧ ---
  const handleSaveStage = (values: any) => {
    const newStage: StageType = {
      id: `s_${Date.now()}`,
      name: values.name,
      description: values.description || '',
      tasks: [],
    };
    setStages([...stages, newStage]);
    setIsStageModalOpen(false);
    stageForm.resetFields();
    message.success('Этап добавлен!');
  };

  const handleDeleteStage = (stageId: string) => {
    setStages(stages.filter((s) => s.id !== stageId));
    message.info('Этап удален');
  };

  const handleSaveTask = (values: any) => {
    if (!activeStageId) return;
    const newTask: TaskType = {
      id: `t_${Date.now()}`,
      name: values.name,
      description: values.description || '',
      days: values.days,
      hours: values.hours,
    };
    setStages(
      stages.map((s) => (s.id === activeStageId ? { ...s, tasks: [...s.tasks, newTask] } : s)),
    );
    setIsTaskModalOpen(false);
    taskForm.resetFields();
    message.success('Задача добавлена!');
  };

  const handleDeleteTask = (stageId: string, taskId: string) => {
    setStages(
      stages.map((s) =>
        s.id === stageId ? { ...s, tasks: s.tasks.filter((t) => t.id !== taskId) } : s,
      ),
    );
  };

  // --- ЛОГИКА КОМАНДЫ ---
  const runAIScoring = () => {
    setIsScoring(true);
    setTimeout(() => {
      setTeam(mockCandidates);
      setIsScoring(false);
      message.success('ИИ успешно подобрал оптимальную команду!');
    }, 1500);
  };

  // --- РЕНДЕРЫ ШАГОВ ---
  const renderStep1 = () => (
    <Form form={formBasic} layout="vertical" initialValues={{ manager: user?.fullName }}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="name" label="Название проекта" rules={[{ required: true }]}>
            <Input size="large" placeholder="Введите название..." />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="goal" label="Бизнес-цель">
        <Input placeholder="Опишите главную цель..." />
      </Form.Item>
      <Form.Item name="description" label="Описание проекта">
        <TextArea rows={4} placeholder="Краткое описание, требования, ограничения..." />
      </Form.Item>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="dateRange" label="Дата начала и окончания" rules={[{ required: true }]}>
            <RangePicker style={{ width: '100%' }} size="large" format="DD.MM.YYYY" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="budget" label="Бюджет">
            <InputNumber
              size="large"
              style={{ width: '100%' }}
              addonAfter={
                <Form.Item name="currency" noStyle initialValue="RUB">
                  <Select style={{ width: 80 }}>
                    <Select.Option value="RUB">₽</Select.Option>
                    <Select.Option value="USD">$</Select.Option>
                  </Select>
                </Form.Item>
              }
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="manager" label="Руководитель проекта" rules={[{ required: true }]}>
            <Input size="large" readOnly={user?.role !== 'ADMIN'} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  const filteredTemplates = aiTemplates.filter((t) =>
    t.title.toLowerCase().includes(templateSearch.toLowerCase()),
  );

  const renderStep2 = () => (
    <div>
      <Input
        size="large"
        placeholder="Поиск по шаблонам..."
        prefix={<SearchOutlined />}
        value={templateSearch}
        onChange={(e) => setTemplateSearch(e.target.value)}
        style={{ marginBottom: 24 }}
      />
      <Row gutter={[16, 16]}>
        {filteredTemplates.map((tpl) => (
          <Col span={12} key={tpl.id}>
            <Card
              hoverable
              style={{
                border: selectedTemplate === tpl.id ? '2px solid #1677ff' : '1px solid #d9d9d9',
              }}
              onClick={() => setSelectedTemplate(tpl.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Title level={5} style={{ margin: 0 }}>
                  {tpl.title}
                </Title>
                <Tag color="green" icon={<RobotOutlined />}>
                  {tpl.match}% Совпадение
                </Tag>
              </div>
              <Text type="secondary">{tpl.desc}</Text>
            </Card>
          </Col>
        ))}
      </Row>
      <Button
        type="dashed"
        style={{ marginTop: 24 }}
        onClick={() => {
          setSelectedTemplate(null);
          next();
        }}
      >
        Пропустить и настроить вручную
      </Button>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Настройте статусы (канбан-колонки), по которым будут двигаться задачи.
      </Text>
      <Space size={[8, 8]} wrap>
        {workflowStages.map((stage) => (
          <Tag color="blue" key={stage} style={{ padding: '6px 12px', fontSize: 14 }}>
            {stage}
          </Tag>
        ))}
      </Space>
    </div>
  );

  const renderStep4 = () => (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsStageModalOpen(true)}>
          Добавить этап
        </Button>
      </div>

      {stages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#bfbfbf' }}>
          Нет ни одного этапа. Нажмите "Добавить этап".
        </div>
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {stages.map((stage) => (
            <Card
              key={stage.id}
              title={
                <span>
                  {stage.name}{' '}
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, fontWeight: 'normal', marginLeft: 8 }}
                  >
                    {stage.description}
                  </Text>
                </span>
              }
              extra={
                <Space>
                  <Button
                    size="small"
                    type="primary"
                    ghost
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setActiveStageId(stage.id);
                      setIsTaskModalOpen(true);
                    }}
                  >
                    Добавить задачу
                  </Button>
                  <Button size="small" icon={<EditOutlined />} />
                  <Popconfirm title="Удалить этап?" onConfirm={() => handleDeleteStage(stage.id)}>
                    <Button size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              }
              styles={{ body: { padding: 0 } }}
            >
              <Table
                dataSource={stage.tasks}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: 'Название задачи',
                    dataIndex: 'name',
                    key: 'name',
                    render: (t) => <Text strong>{t}</Text>,
                  },
                  { title: 'Описание', dataIndex: 'description', key: 'description' },
                  { title: 'Длительность (дни)', dataIndex: 'days', key: 'days', width: 150 },
                  { title: 'Трудозатраты (часы)', dataIndex: 'hours', key: 'hours', width: 180 },
                  {
                    title: '',
                    key: 'action',
                    align: 'right',
                    width: 80,
                    render: (_, record) => (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteTask(stage.id, record.id)}
                      />
                    ),
                  },
                ]}
              />
            </Card>
          ))}
        </Space>
      )}

      {/* Модалки для Этапа и Задачи */}
      <Modal
        title="Новый этап"
        open={isStageModalOpen}
        onOk={() => stageForm.submit()}
        onCancel={() => setIsStageModalOpen(false)}
      >
        <Form form={stageForm} layout="vertical" onFinish={handleSaveStage}>
          <Form.Item name="name" label="Название этапа" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Новая задача"
        open={isTaskModalOpen}
        onOk={() => taskForm.submit()}
        onCancel={() => setIsTaskModalOpen(false)}
      >
        <Form form={taskForm} layout="vertical" onFinish={handleSaveTask}>
          <Form.Item name="name" label="Название задачи" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="days" label="Длительность (дни)" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="hours" label="Трудозатраты (часы)" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );

  const filteredTeam = team.filter(
    (m) =>
      m.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      m.role.toLowerCase().includes(teamSearch.toLowerCase()),
  );

  const renderStep5 = () => (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={14}>
          <Input
            placeholder="Поиск по ФИО или роли..."
            prefix={<SearchOutlined />}
            value={teamSearch}
            onChange={(e) => setTeamSearch(e.target.value)}
          />
        </Col>
        <Col span={10} style={{ textAlign: 'right' }}>
          <Space>
            <Button icon={<PlusOutlined />}>Добавить вручную</Button>
            <Button
              type="primary"
              icon={<RobotOutlined />}
              onClick={runAIScoring}
              loading={isScoring}
            >
              ИИ-Скоринг Команды
            </Button>
          </Space>
        </Col>
      </Row>

      {team.length > 0 ? (
        <Table
          dataSource={filteredTeam}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: 'Сотрудник',
              render: (r) => (
                <Space>
                  <Avatar src={r.avatar} />
                  {r.name}
                </Space>
              ),
            },
            { title: 'Роль', dataIndex: 'role' },
            {
              title: 'Компетенции',
              dataIndex: 'skills',
              render: (skills: string[]) => (
                <Space size={[0, 4]} wrap>
                  {skills.map((s) => (
                    <Tag color="blue" key={s}>
                      {s}
                    </Tag>
                  ))}
                </Space>
              ),
            },
            {
              title: 'Совпадение',
              render: (r) => (
                <Text style={{ color: '#52c41a' }}>
                  <SafetyCertificateOutlined /> {r.match}%
                </Text>
              ),
            },
            {
              title: '',
              key: 'action',
              align: 'right',
              render: (r) => (
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => setTeam(team.filter((t) => t.id !== r.id))}
                />
              ),
            },
          ]}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#bfbfbf' }}>
          Команда пока пуста. Нажмите "ИИ-Скоринг" или добавьте вручную.
        </div>
      )}
    </div>
  );

  const steps = [
    { title: 'Паспорт', icon: <ProjectOutlined />, content: renderStep1() },
    { title: 'Шаблоны', icon: <RobotOutlined />, content: renderStep2() },
    { title: 'WorkFlow', icon: <NodeIndexOutlined />, content: renderStep3() },
    { title: 'Этапы/Задачи', icon: <UnorderedListOutlined />, content: renderStep4() },
    { title: 'Команда', icon: <TeamOutlined />, content: renderStep5() },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
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
            Создание проекта
          </Title>
          <Text type="secondary">Мастер инициализации нового проекта</Text>
        </div>
        <Button onClick={handleExit}>Выйти</Button>
      </div>

      <Card variant="borderless">
        <Steps
          current={currentStep}
          items={steps.map((s) => ({ title: s.title, icon: s.icon }))}
          style={{ marginBottom: 40 }}
        />

        <div
          style={{
            minHeight: 300,
            background: '#fafafa',
            padding: 24,
            borderRadius: 8,
            border: '1px solid #f0f0f0',
          }}
        >
          {steps[currentStep].content}
        </div>

        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={prev} disabled={currentStep === 0}>
            Назад
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button type="primary" onClick={next}>
              Далее
            </Button>
          ) : (
            <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleFinish}>
              Запустить проект
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
