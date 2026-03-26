import { useState } from 'react';
import {
  Typography,
  Table,
  Progress,
  Avatar,
  Space,
  Tag,
  Button,
  Card,
  Drawer,
  Select,
  Divider,
  message,
  Form,
  Modal,
  Input,
  InputNumber,
} from 'antd';
import { UserOutlined, UserAddOutlined, SettingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  workload: number;
  permissions: string[]; // Теперь это массив строковых тегов
}

const initialTeam: TeamMember[] = [
  {
    id: 'u1',
    name: 'Иван Иванов',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
    role: 'Backend Разработчик',
    workload: 85,
    permissions: ['task_edit', 'view_reports'],
  },
  {
    id: 'u2',
    name: 'Анна Смирнова',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
    role: 'Frontend Разработчик',
    workload: 40,
    permissions: ['task_edit'],
  },
  {
    id: 'u3',
    name: 'Алексей Руководителев',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    role: 'Тимлид',
    workload: 110,
    permissions: ['task_edit', 'view_reports', 'manage_backlog', 'manage_team'],
  },
];

// Доступные системные права для подсказок
const availablePermissions = [
  { value: 'task_edit', label: 'Редактирование задач' },
  { value: 'view_reports', label: 'Просмотр отчетов' },
  { value: 'manage_backlog', label: 'Управление бэклогом' },
  { value: 'manage_team', label: 'Управление командой' },
  { value: 'admin_access', label: 'Полный доступ' },
];

export const TeamManagement = () => {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null);

  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [inviteForm] = Form.useForm();

  const columns = [
    {
      title: 'Сотрудник',
      key: 'user',
      render: (record: TeamMember) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <Text strong style={{ display: 'block' }}>
              {record.name}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.role}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Текущая загрузка',
      key: 'workload',
      width: 200,
      render: (record: TeamMember) => (
        <div>
          <Progress
            percent={record.workload > 100 ? 100 : record.workload}
            status={record.workload > 100 ? 'exception' : 'normal'}
            strokeColor={record.workload > 100 ? undefined : '#1677ff'}
            format={() => `${record.workload}%`}
          />
          {record.workload > 100 && (
            <Tag color="red" style={{ marginTop: 4 }}>
              Перегруз
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Права доступа',
      key: 'permissions',
      render: (record: TeamMember) => (
        <Space size={[0, 4]} wrap>
          {record.permissions.slice(0, 2).map((p) => (
            <Tag key={p} color="blue">
              {p}
            </Tag>
          ))}
          {record.permissions.length > 2 && <Tag>+{record.permissions.length - 2}</Tag>}
        </Space>
      ),
    },
    {
      title: 'Настройки',
      key: 'actions',
      align: 'right' as const,
      render: (record: TeamMember) => (
        <Button icon={<SettingOutlined />} onClick={() => setSelectedUser(record)}>
          Настроить
        </Button>
      ),
    },
  ];

  const handleSavePermissions = (newPermissions: string[]) => {
    if (!selectedUser) return;
    setTeam((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? { ...u, permissions: newPermissions } : u)),
    );
    setSelectedUser((prev) => (prev ? { ...prev, permissions: newPermissions } : null));
    message.success('Права успешно обновлены!');
  };

  const handleInviteSubmit = (values: any) => {
    // В реальности шлем POST /api/project-members
    message.success(
      `Сотрудник успешно добавлен в команду проекта с загрузкой ${values.allocation_percent}%`,
    );
    setIsInviteModalVisible(false);
    inviteForm.resetFields();
  };

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
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Управление командой
          </Title>
          <Text type="secondary">Настройка ролей и доступов участников проекта</Text>
        </div>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          size="large"
          onClick={() => setIsInviteModalVisible(true)}
        >
          Пригласить участника
        </Button>
      </div>

      <Card variant="borderless" styles={{ body: { padding: 0 } }}>
        <Table dataSource={team} columns={columns} rowKey="id" pagination={false} />
      </Card>

      {/* Сайдбар настройки пользователя */}
      <Drawer
        title="Настройка доступов"
        placement="right"
        width={400}
        onClose={() => setSelectedUser(null)}
        open={!!selectedUser}
      >
        {selectedUser && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Avatar src={selectedUser.avatar} size={80} style={{ marginBottom: 12 }} />
              <Title level={4} style={{ margin: 0 }}>
                {selectedUser.name}
              </Title>
              <Text type="secondary">{selectedUser.role}</Text>
            </div>

            <Divider />

            <div>
              <Text strong style={{ display: 'block', marginBottom: 12 }}>
                Теги прав доступа (Разрешения):
              </Text>
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Введите или выберите право (через пробел)"
                value={selectedUser.permissions}
                onChange={handleSavePermissions}
                options={availablePermissions}
                tokenSeparators={[' ']} // Позволяет вводить теги через пробел
                size="large"
              />
              <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                * Вы можете выбрать из списка или ввести свое кастомное право и нажать Enter/Пробел.
              </Text>
            </div>
          </Space>
        )}
      </Drawer>

      <Modal
        title="Пригласить в проект (PROJECT_MEMBER)"
        open={isInviteModalVisible}
        onOk={() => inviteForm.submit()}
        onCancel={() => setIsInviteModalVisible(false)}
      >
        <Form
          form={inviteForm}
          layout="vertical"
          onFinish={handleInviteSubmit}
          initialValues={{ allocation_percent: 100 }}
        >
          <Form.Item name="user_id" label="Сотрудник" rules={[{ required: true }]}>
            <Select placeholder="Выберите из базы (user_id)">
              <Select.Option value="u4">Пётр Иванов (Frontend)</Select.Option>
              <Select.Option value="u5">Елена Дёмина (QA)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="project_role"
            label="Роль в проекте (project_role)"
            rules={[{ required: true }]}
          >
            <Input placeholder="Например: Ведущий аналитик" />
          </Form.Item>
          <Form.Item name="allocation_percent" label="Выделенная загрузка (%)">
            <InputNumber min={10} max={100} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
