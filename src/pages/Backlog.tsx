import { useState } from 'react';
import {
  Typography,
  Table,
  Tag,
  Button,
  Card,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
} from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useUiStore } from '../store/uiStore';

const { Title, Text } = Typography;

const initialTasks = [
  {
    id: 't_1',
    title: 'Спроектировать API',
    stage: 'Аналитика',
    deadline: '20.06.2026',
    priority: 'HIGH',
    assignee: 'Иван Иванов',
  },
  {
    id: 't_2',
    title: 'Настроить CI/CD',
    stage: 'Разработка',
    deadline: '25.06.2026',
    priority: 'MEDIUM',
    assignee: 'Анна Смирнова',
  },
  {
    id: 't_3',
    title: 'Сверстать модалки',
    stage: 'Дизайн',
    deadline: '10.07.2026',
    priority: 'LOW',
    assignee: 'Пётр Иванов',
  },
];

export const Backlog = () => {
  const { openTaskDrawer } = useUiStore();
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleCreate = (values: any) => {
    const newTask = {
      id: `t_${Date.now().toString().slice(-4)}`,
      title: values.title,
      stage: values.stage,
      deadline: values.deadline ? values.deadline.format('DD.MM.YYYY') : 'Не задан',
      priority: values.priority,
      assignee: values.assignee || 'Не назначен',
    };
    setTasks([...tasks, newTask]);
    message.success('Задача добавлена в бэклог!');
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Этап',
      dataIndex: 'stage',
      key: 'stage',
      render: (s: string) => <Tag color="blue">{s}</Tag>,
    },
    { title: 'Дедлайн', dataIndex: 'deadline', key: 'deadline' },
    { title: 'Исполнитель', dataIndex: 'assignee', key: 'assignee' },
    {
      title: 'Действия',
      key: 'actions',
      align: 'right' as const,
      render: (record: any) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => openTaskDrawer(record.id)}>
          Открыть
        </Button>
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
            Бэклог проекта
          </Title>
          <Text type="secondary">Пул задач на будущее планирование и проработку.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Добавить задачу
        </Button>
      </div>

      <Card variant="borderless" styles={{ body: { padding: 0 } }}>
        <Table dataSource={tasks} columns={columns} rowKey="id" pagination={{ pageSize: 15 }} />
      </Card>

      <Modal
        title="Создать задачу в Бэклог"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        okText="Создать"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{ priority: 'MEDIUM' }}
        >
          <Form.Item name="title" label="Название задачи" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="stage" label="Этап" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Аналитика">Аналитика</Select.Option>
              <Select.Option value="Дизайн">Дизайн</Select.Option>
              <Select.Option value="Разработка">Разработка</Select.Option>
              <Select.Option value="Тестирование">Тестирование</Select.Option>
            </Select>
          </Form.Item>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="deadline" label="Дедлайн" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
            </Form.Item>
            <Form.Item name="priority" label="Приоритет" style={{ flex: 1 }}>
              <Select>
                <Select.Option value="HIGH">Высокий</Select.Option>
                <Select.Option value="MEDIUM">Средний</Select.Option>
                <Select.Option value="LOW">Низкий</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="assignee" label="Исполнитель">
            <Input placeholder="ФИО сотрудника" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
