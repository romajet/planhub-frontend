import { useState } from 'react';
import {
  Typography,
  Row,
  Col,
  Card,
  Tree,
  Table,
  Avatar,
  Space,
  Tag,
  Button,
  Input,
  message,
  Modal,
  Form,
  Select,
  Drawer,
} from 'antd';
import {
  ApartmentOutlined,
  UserOutlined,
  TeamOutlined,
  SearchOutlined,
  PlusOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

const { Title, Text } = Typography;

const treeData: DataNode[] = [
  {
    title: 'Головной офис (Москва)',
    key: 'hq',
    icon: <ApartmentOutlined />,
    children: [
      {
        title: 'IT Департамент',
        key: 'it_dept',
        icon: <TeamOutlined />,
        children: [
          { title: 'Отдел Frontend разработки', key: 'frontend', isLeaf: true },
          { title: 'Отдел Backend разработки', key: 'backend', isLeaf: true },
        ],
      },
      { title: 'HR & Кадры', key: 'hr', isLeaf: true },
    ],
  },
];

const mockEmployees = [
  {
    id: '1',
    name: 'Иван Иванов',
    email: 'ivan@planhub.ru',
    phone: '+7 (999) 111-22-33',
    role: 'Senior Backend',
    dept: 'backend',
    systemRole: 'EMPLOYEE',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
    skills: ['Java', 'Spring', 'PostgreSQL'],
    workload: 80,
    projects: ['CRM Альфа'],
  },
  {
    id: '2',
    name: 'Анна Смирнова',
    email: 'anna@planhub.ru',
    phone: '+7 (900) 555-44-33',
    role: 'Lead Frontend',
    dept: 'frontend',
    systemRole: 'MANAGER',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
    skills: ['React', 'TypeScript', 'Zustand'],
    workload: 40,
    projects: ['CRM Альфа', 'Сайт Бета'],
  },
];

export const CompanyStructure = () => {
  const [selectedDeptKey, setSelectedDeptKey] = useState<string>('backend');
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState(mockEmployees);

  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  const [deptForm] = Form.useForm();
  const [empForm] = Form.useForm();

  const onSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) setSelectedDeptKey(selectedKeys[0] as string);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchDept = emp.dept === selectedDeptKey || selectedDeptKey === 'hq';
    const matchSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  const handleAddDept = (values: any) => {
    message.success(`Отдел "${values.name}" добавлен!`);
    setIsDeptModalOpen(false);
    deptForm.resetFields();
  };
  const handleAddEmp = (values: any) => {
    setEmployees([
      ...employees,
      {
        id: Date.now().toString(),
        name: values.name,
        email: values.email,
        phone: '+7 (---) ---',
        role: values.role,
        dept: selectedDeptKey === 'hq' ? 'frontend' : selectedDeptKey,
        systemRole: values.systemRole,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.name}`,
        skills: [],
        workload: 0,
        projects: [],
      },
    ]);
    message.success('Сотрудник добавлен!');
    setIsEmpModalOpen(false);
    empForm.resetFields();
  };

  const columns = [
    {
      title: 'Сотрудник',
      key: 'user',
      render: (record: any) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <Text strong>{record.name}</Text>
        </Space>
      ),
    },
    {
      title: 'Должность',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: 'Действия',
      key: 'actions',
      align: 'right' as const,
      render: (record: any) => (
        <Button type="link" size="small" onClick={() => setSelectedProfile(record)}>
          Профиль
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
          alignItems: 'flex-start',
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Структура компании
          </Title>
          <Text type="secondary">Организационное дерево и профили сотрудников</Text>
        </div>
        <Space>
          <Button icon={<ApartmentOutlined />} onClick={() => setIsDeptModalOpen(true)}>
            Добавить отдел
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsEmpModalOpen(true)}>
            Новый сотрудник
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Card title="Подразделения" variant="borderless" style={{ minHeight: '65vh' }}>
            <Tree
              showIcon
              defaultExpandAll
              defaultSelectedKeys={['backend']}
              treeData={treeData}
              onSelect={onSelect}
              style={{ fontSize: 16 }}
            />
          </Card>
        </Col>
        <Col span={16}>
          <Card
            title={
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>Сотрудники ({filteredEmployees.length})</span>
                <Input
                  placeholder="Поиск по ФИО или должности"
                  prefix={<SearchOutlined />}
                  style={{ width: 250 }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            }
            variant="borderless"
            styles={{ body: { padding: 0 } }}
            style={{ minHeight: '65vh' }}
          >
            <Table
              dataSource={filteredEmployees}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 8 }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Новое подразделение"
        open={isDeptModalOpen}
        onOk={() => deptForm.submit()}
        onCancel={() => setIsDeptModalOpen(false)}
      >
        <Form form={deptForm} layout="vertical" onFinish={handleAddDept}>
          <Form.Item name="name" label="Название отдела" rules={[{ required: true }]}>
            <Input placeholder="Отдел маркетинга" />
          </Form.Item>
          <Form.Item name="parent" label="Родитель" initialValue="hq">
            <Select>
              <Select.Option value="hq">Головной офис</Select.Option>
              <Select.Option value="it">IT Департамент</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Новый сотрудник в штат"
        open={isEmpModalOpen}
        onOk={() => empForm.submit()}
        onCancel={() => setIsEmpModalOpen(false)}
      >
        <Form
          form={empForm}
          layout="vertical"
          onFinish={handleAddEmp}
          initialValues={{ systemRole: 'EMPLOYEE' }}
        >
          <Form.Item name="name" label="ФИО" rules={[{ required: true }]}>
            <Input placeholder="Иванов Иван Иванович" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="ivan@planhub.ru" />
          </Form.Item>
          <Form.Item name="role" label="Должность" rules={[{ required: true }]}>
            <Input placeholder="Frontend разработчик" />
          </Form.Item>
          <Form.Item name="systemRole" label="Системная Роль (USER_ROLE)">
            <Select>
              <Select.Option value="EMPLOYEE">Сотрудник</Select.Option>
              <Select.Option value="MANAGER">Руководитель</Select.Option>
              <Select.Option value="ADMIN">Администратор</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* РАСШИРЕННЫЙ ПРОФИЛЬ СОТРУДНИКА */}
      <Drawer
        title="Профиль сотрудника"
        placement="right"
        width={450}
        onClose={() => setSelectedProfile(null)}
        open={!!selectedProfile}
        extra={<Button icon={<EditOutlined />}>Редактировать</Button>}
      >
        {selectedProfile && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Avatar src={selectedProfile.avatar} size={90} style={{ marginBottom: 12 }} />
              <Title level={3} style={{ margin: 0 }}>
                {selectedProfile.name}
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                {selectedProfile.role}
              </Text>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                background: '#f8fafd',
                padding: 16,
                borderRadius: 8,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary" style={{ display: 'block' }}>
                  Загрузка
                </Text>
                <Text
                  strong
                  style={{
                    fontSize: 18,
                    color: selectedProfile.workload > 80 ? '#cf1322' : '#52c41a',
                  }}
                >
                  {selectedProfile.workload}%
                </Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary" style={{ display: 'block' }}>
                  Проекты
                </Text>
                <Text strong style={{ fontSize: 18 }}>
                  {selectedProfile.projects.length}
                </Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary" style={{ display: 'block' }}>
                  Доступ
                </Text>
                <Text strong style={{ fontSize: 18 }}>
                  <IdcardOutlined /> {selectedProfile.systemRole === 'MANAGER' ? 'Рук.' : 'Сотр.'}
                </Text>
              </div>
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Контакты
              </Text>
              <Space direction="vertical">
                <Text>
                  <MailOutlined style={{ marginRight: 8 }} />
                  {selectedProfile.email}
                </Text>
                <Text>
                  <PhoneOutlined style={{ marginRight: 8 }} />
                  {selectedProfile.phone}
                </Text>
                <Text>
                  <ApartmentOutlined style={{ marginRight: 8 }} />
                  {selectedProfile.dept === 'hq' ? 'Головной офис' : 'IT Департамент'}
                </Text>
              </Space>
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Текущие проекты
              </Text>
              <Space size={[0, 8]} wrap>
                {selectedProfile.projects.length > 0 ? (
                  selectedProfile.projects.map((p: string) => <Tag key={p}>{p}</Tag>)
                ) : (
                  <Text type="secondary">Нет активных проектов</Text>
                )}
              </Space>
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Компетенции
              </Text>
              <Space size={[0, 8]} wrap>
                {selectedProfile.skills && selectedProfile.skills.length > 0 ? (
                  selectedProfile.skills.map((s: string) => (
                    <Tag color="blue" key={s}>
                      {s}
                    </Tag>
                  ))
                ) : (
                  <Text type="secondary">Навыки не указаны</Text>
                )}
              </Space>
            </div>
          </Space>
        )}
      </Drawer>
    </div>
  );
};
