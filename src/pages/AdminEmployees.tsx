import { useState } from 'react';
import {
  Typography,
  Table,
  Button,
  Space,
  Avatar,
  Tag,
  Progress,
  Card,
  Modal,
  Form,
  Input,
  Select,
  message,
} from 'antd';
import { UserOutlined, PlusOutlined, EditOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Стартовые мок-данные
const initialEmployees = [
  {
    id: '1',
    name: 'Анна Петрова',
    email: 'anna@planhub.ru',
    department: 'Бэкенд-разработка',
    role: 'Руководитель',
    systemRole: 'MANAGER',
    projects: ['Альфа', 'Бета'],
    workload: 85,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
  },
  {
    id: '2',
    name: 'Иван Соколов',
    email: 'ivan@planhub.ru',
    department: 'Бэкенд-разработка',
    role: 'Senior Developer',
    systemRole: 'EMPLOYEE',
    projects: ['Альфа'],
    workload: 80,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
  },
  {
    id: '3',
    name: 'Елена Дёмина',
    email: 'elena@planhub.ru',
    department: 'QA & Тестирование',
    role: 'QA Engineer',
    systemRole: 'EMPLOYEE',
    projects: ['Альфа', 'Гамма'],
    workload: 105,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
  },
];

export const AdminEmployees = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Функция сохранения (работает и для создания, и для редактирования)
  const handleSaveEmployee = (values: any) => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (editingId) {
        // Редактирование
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === editingId
              ? {
                  ...emp,
                  name: values.full_name,
                  email: values.email,
                  department: values.department,
                  role: values.position,
                  systemRole: values.systemRole,
                }
              : emp,
          ),
        );
        message.success('Данные сотрудника обновлены!');
      } else {
        // Создание
        const newEmployee = {
          id: `emp_${Date.now()}`,
          name: values.full_name,
          email: values.email,
          department: values.department,
          role: values.position,
          systemRole: values.systemRole,
          projects: [],
          workload: 0,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.full_name.replace(/\s/g, '')}`,
        };
        setEmployees([newEmployee, ...employees]);
        message.success('Сотрудник успешно добавлен в систему!');
      }
      setIsSubmitting(false);
      setIsModalVisible(false);
      form.resetFields();
      setEditingId(null);
    }, 800);
  };

  // Функция открытия модалки в режиме редактирования
  const handleEditClick = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue({
      full_name: record.name,
      email: record.email,
      department: record.department,
      position: record.role,
      systemRole: record.systemRole,
    });
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Сотрудник',
      key: 'user',
      render: (record: any) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <Text strong style={{ display: 'block' }}>
              {record.name}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Отдел',
      dataIndex: 'department',
      key: 'department',
      render: (text: string) => <Text type="secondary">{text}</Text>,
    },
    {
      title: 'Должность',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: 'Системная Роль',
      dataIndex: 'systemRole',
      key: 'systemRole',
      render: (sysRole: string) => (
        <Tag color={sysRole === 'ADMIN' ? 'red' : sysRole === 'MANAGER' ? 'purple' : 'default'}>
          {sysRole}
        </Tag>
      ),
    },
    {
      title: 'Проекты',
      dataIndex: 'projects',
      key: 'projects',
      render: (projects: string[]) => (
        <Space size={[0, 4]} wrap>
          {projects.length > 0 ? (
            projects.map((p) => <Tag key={p}>{p}</Tag>)
          ) : (
            <Text type="secondary">Нет</Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Загрузка',
      dataIndex: 'workload',
      key: 'workload',
      width: 150,
      render: (percent: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Progress
            percent={percent > 100 ? 100 : percent}
            status={percent > 100 ? 'exception' : 'normal'}
            strokeColor={percent > 100 ? undefined : '#1677ff'}
            style={{ flex: 1, marginBottom: 0 }}
            showInfo={false}
          />
          <Text type={percent > 100 ? 'danger' : 'secondary'} style={{ fontSize: 12, width: 35 }}>
            {percent}%
          </Text>
        </div>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      align: 'right' as const,
      render: (record: any) => (
        <Button icon={<EditOutlined />} size="small" onClick={() => handleEditClick(record)} />
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
            Сотрудники
          </Title>
          <Text type="secondary">Глобальный справочник персонала компании</Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Добавить сотрудника
        </Button>
      </div>

      <Card variant="borderless" styles={{ body: { padding: 0 } }}>
        <Table dataSource={employees} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      {/* Форма добавления сотрудника (USER) */}
      <Modal
        title="Добавить нового сотрудника"
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        confirmLoading={isSubmitting}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveEmployee}
          style={{ marginTop: 20 }}
          initialValues={{ systemRole: 'EMPLOYEE' }}
        >
          <Form.Item
            name="full_name"
            label="ФИО (full_name)"
            rules={[{ required: true, message: 'Введите ФИО' }]}
          >
            <Input
              placeholder="Иванов Иван Иванович"
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Рабочий Email (email)"
            rules={[{ required: true, type: 'email', message: 'Введите корректный email' }]}
          >
            <Input
              placeholder="ivanov@company.com"
              prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="department"
              label="Отдел"
              style={{ flex: 1 }}
              rules={[{ required: true }]}
            >
              <Select placeholder="Выберите отдел">
                <Select.Option value="Бэкенд-разработка">Бэкенд-разработка</Select.Option>
                <Select.Option value="Фронтенд-разработка">Фронтенд-разработка</Select.Option>
                <Select.Option value="QA & Тестирование">QA & Тестирование</Select.Option>
                <Select.Option value="Аналитика">Аналитика</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="position"
              label="Должность (position)"
              style={{ flex: 1 }}
              rules={[{ required: true }]}
            >
              <Input placeholder="Например: Senior Backend" />
            </Form.Item>
          </div>

          <Form.Item name="systemRole" label="Уровень доступа (USER_ROLE)">
            <Select>
              <Select.Option value="EMPLOYEE">Сотрудник (Только свои задачи)</Select.Option>
              <Select.Option value="MANAGER">Менеджер (Управление проектами)</Select.Option>
              <Select.Option value="ADMIN">Администратор (Полный доступ)</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
