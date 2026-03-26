import { useState } from 'react';
import {
  Steps,
  Button,
  Card,
  Typography,
  Space,
  Table,
  Tag,
  DatePicker,
  InputNumber,
  Input,
  message,
  Row,
  Col,
} from 'antd';
import {
  RobotOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

// --- Мок-данные для шаблонов от ИИ ---
const aiTemplates = [
  {
    id: 'tpl_1',
    title: 'Корпоративный портал (Agile)',
    match: 95,
    tasksCount: 24,
    description: 'Идеально подходит на основе вашего прошлого проекта "Внутренняя CRM".',
  },
  {
    id: 'tpl_2',
    title: 'Интернет-магазин (Waterfall)',
    match: 78,
    tasksCount: 45,
    description: 'Стандартный пакет для e-commerce с полным циклом тестирования.',
  },
];

// --- Мок-данные задач выбранного шаблона ---
const initialTasks = [
  { id: 't1', title: 'Сбор бизнес-требований', role: 'Аналитик', hours: 40 },
  { id: 't2', title: 'Проектирование БД', role: 'Архитектор', hours: 24 },
  { id: 't3', title: 'Разработка API', role: 'Backend Разработчик', hours: 80 },
  { id: 't4', title: 'Настройка CI/CD', role: 'DevOps', hours: 16 },
];

export const ProjectImportWizard = () => {
  const navigate = useNavigate();

  // Состояния нашего мастера
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(
    initialTasks.map((t) => t.id),
  );

  // Переходы между шагами
  const next = () => setCurrentStep(currentStep + 1);
  const prev = () => setCurrentStep(currentStep - 1);
  const onFinish = () => {
    message.success('Базовый план проекта успешно сформирован!');
    navigate('/projects'); // Возвращаемся к списку проектов
  };

  // --- Рендер Шага 1: Выбор пакета ---
  const renderStep1 = () => (
    <Row gutter={[16, 16]}>
      {aiTemplates.map((tpl) => (
        <Col span={12} key={tpl.id}>
          <Card
            hoverable
            style={{
              border: selectedTemplate === tpl.id ? '2px solid #1677ff' : '1px solid #d9d9d9',
            }}
            onClick={() => setSelectedTemplate(tpl.id)}
          >
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <Title level={4} style={{ marginTop: 0 }}>
                {tpl.title}
              </Title>
              <Tag color="green" icon={<RobotOutlined />}>
                {tpl.match}% Совпадение
              </Tag>
            </div>
            <Text type="secondary">{tpl.description}</Text>
            <div style={{ marginTop: 16 }}>
              <Tag>Задач: {tpl.tasksCount}</Tag>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );

  // --- Рендер Шага 2: Структура и оценки (Шаги 2 и 3 из BPMN объединим для удобства) ---
  const renderStep2 = () => {
    const columns = [
      {
        title: 'Название задачи',
        dataIndex: 'title',
        render: (text: string, record: any) => (
          <Input
            defaultValue={text}
            onChange={(e) => {
              const newTasks = tasks.map((t) =>
                t.id === record.id ? { ...t, title: e.target.value } : t,
              );
              setTasks(newTasks);
            }}
          />
        ),
      },
      { title: 'Требуемая роль', dataIndex: 'role' },
      {
        title: 'Трудозатраты (часы)',
        dataIndex: 'hours',
        render: (hours: number, record: any) => (
          <InputNumber
            min={1}
            defaultValue={hours}
            onChange={(val) => {
              const newTasks = tasks.map((t) =>
                t.id === record.id ? { ...t, hours: val || 0 } : t,
              );
              setTasks(newTasks);
            }}
          />
        ),
      },
    ];

    return (
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
        }}
        columns={columns}
        dataSource={tasks}
        rowKey="id"
        pagination={false}
      />
    );
  };

  // --- Рендер Шага 3: Календарь и пересчет ---
  const renderStep3 = () => (
    <Card variant="borderless" style={{ textAlign: 'center', padding: '40px 0' }}>
      <Space orientation="vertical" size="large">
        <Title level={4}>Укажите дату начала проекта</Title>
        <DatePicker size="large" style={{ width: 300 }} />
        <Text type="secondary">
          Система автоматически пересчитает даты выполнения всех {selectedRowKeys.length} выбранных
          задач с учетом зависимостей и стандартного рабочего календаря.
        </Text>
        <Button
          type="primary"
          size="large"
          icon={<CalendarOutlined />}
          onClick={() => message.info('Даты успешно пересчитаны!')}
        >
          Пересчитать расписание
        </Button>
      </Space>
    </Card>
  );

  // Конфигурация шагов
  const steps = [
    { title: 'Выбор пакета', icon: <RobotOutlined />, content: renderStep1() },
    { title: 'Настройка задач', icon: <SettingOutlined />, content: renderStep2() },
    { title: 'Расписание', icon: <CalendarOutlined />, content: renderStep3() },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0 }}>
          ИИ-Мастер переноса плана
        </Title>
        <Text type="secondary">Формирование базового плана на основе исторического опыта</Text>
      </div>

      <Card>
        <Steps
          current={currentStep}
          items={steps.map((s) => ({ title: s.title, icon: s.icon }))}
          style={{ marginBottom: 40 }}
        />

        <div style={{ minHeight: 300 }}>{steps[currentStep].content}</div>

        <div
          style={{
            marginTop: 40,
            paddingTop: 24,
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
          }}
        >
          {currentStep > 0 && <Button onClick={prev}>Назад</Button>}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={next} disabled={currentStep === 0 && !selectedTemplate}>
              Далее
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" icon={<CheckCircleOutlined />} onClick={onFinish}>
              Сформировать план
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
