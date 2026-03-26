import { useState } from 'react';
import {
  Typography,
  Card,
  Row,
  Col,
  Avatar,
  Form,
  Input,
  Button,
  Tabs,
  Select,
  Table,
  DatePicker,
  message,
  Space,
  Divider,
  Tag,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
  PlusOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Справочник всех возможных навыков в системе
const SKILLS_DB = [
  { value: 'React', label: 'React' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'Python', label: 'Python' },
  { value: 'FastAPI', label: 'FastAPI' },
  { value: 'PostgreSQL', label: 'PostgreSQL' },
  { value: 'Docker', label: 'Docker' },
  { value: 'Figma', label: 'Figma' },
];

export const UserProfile = () => {
  const { user } = useAuthStore();
  const [form] = Form.useForm();

  // Мок-данные из USER_SKILL
  const [skills, setSkills] = useState(['React', 'TypeScript']);

  // Мок-данные из USER_AVAILABILITY
  const [availability, setAvailability] = useState([
    { id: '1', period: '10.06.2026 - 24.06.2026', type: 'Отпуск', load_percent: 0 },
    { id: '2', period: '01.09.2026 - 05.09.2026', type: 'Конференция', load_percent: 20 },
  ]);

  const handleUpdateProfile = () => {
    message.success('Профиль успешно обновлен!');
  };

  const handleUpdateSkills = (newSkills: string[]) => {
    setSkills(newSkills);
    message.success('Компетенции обновлены!');
  };

  const handleAddAvailability = (values: any) => {
    if (!values.dates) return;
    const newAvail = {
      id: Date.now().toString(),
      period: `${values.dates[0].format('DD.MM.YYYY')} - ${values.dates[1].format('DD.MM.YYYY')}`,
      type: values.type || 'Отсутствие',
      load_percent: values.load_percent || 0,
    };
    setAvailability([newAvail, ...availability]);
    message.success('Период добавлен в график!');
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Личный кабинет
        </Title>
        <Text type="secondary">Настройки профиля, компетенции и график доступности</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* ЛЕВАЯ КОЛОНКА: Визитка */}
        <Col span={8}>
          <Card variant="borderless" style={{ textAlign: 'center', minHeight: 400 }}>
            <Avatar
              size={120}
              src={
                user?.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || 'User'}`
              }
              icon={<UserOutlined />}
              style={{ marginBottom: 16 }}
            />
            <Title level={3} style={{ margin: 0 }}>
              {user?.fullName || 'Пользователь'}
            </Title>
            <Text type="secondary" style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>
              {user?.role === 'ADMIN'
                ? 'Администратор'
                : user?.role === 'MANAGER'
                  ? 'Руководитель проектов'
                  : 'Специалист'}
            </Text>

            <Space
              size={[0, 8]}
              wrap
              style={{ marginBottom: 24, justifyContent: 'center', width: '100%' }}
            >
              {skills.map((skill) => (
                <Tag color="blue" key={skill}>
                  {skill}
                </Tag>
              ))}
            </Space>

            <Divider />

            <div style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: 12 }}>
                <Text type="secondary" style={{ display: 'block' }}>
                  Email
                </Text>
                <Text strong>
                  <MailOutlined /> {user?.email || 'user@planhub.ru'}
                </Text>
              </div>
              <div>
                <Text type="secondary" style={{ display: 'block' }}>
                  Отдел
                </Text>
                <Text strong>
                  <ApartmentOutlined /> IT Департамент
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* ПРАВАЯ КОЛОНКА: Настройки */}
        <Col span={16}>
          <Card variant="borderless" style={{ minHeight: 400 }}>
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: '1',
                  label: (
                    <span>
                      <UserOutlined /> Основные данные
                    </span>
                  ),
                  children: (
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={handleUpdateProfile}
                      initialValues={{
                        name: user?.fullName,
                        email: user?.email,
                        position: 'Разработчик',
                      }}
                    >
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item name="name" label="ФИО" rules={[{ required: true }]}>
                            <Input size="large" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, type: 'email' }]}
                          >
                            <Input size="large" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item name="position" label="Должность">
                            <Input size="large" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="phone" label="Телефон">
                            <Input size="large" placeholder="+7 (999) 000-00-00" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Button type="primary" htmlType="submit">
                        Сохранить изменения
                      </Button>
                    </Form>
                  ),
                },
                {
                  key: '2',
                  label: (
                    <span>
                      <SafetyCertificateOutlined /> Компетенции (USER_SKILL)
                    </span>
                  ),
                  children: (
                    <div>
                      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                        Укажите ваши навыки. ИИ использует эти данные для рекомендаций при подборе
                        проектных команд.
                      </Text>
                      <Select
                        mode="tags"
                        style={{ width: '100%', marginBottom: 16 }}
                        size="large"
                        placeholder="Выберите навыки из справочника или введите свои"
                        value={skills}
                        onChange={handleUpdateSkills}
                        options={SKILLS_DB}
                        tokenSeparators={[' ']}
                      />
                    </div>
                  ),
                },
                {
                  key: '3',
                  label: (
                    <span>
                      <CalendarOutlined /> Доступность (USER_AVAILABILITY)
                    </span>
                  ),
                  children: (
                    <div>
                      <div
                        style={{
                          background: '#f8fafd',
                          padding: 16,
                          borderRadius: 8,
                          marginBottom: 24,
                          border: '1px solid #e0e9f2',
                        }}
                      >
                        <Title level={5} style={{ marginTop: 0 }}>
                          Добавить период отсутствия
                        </Title>
                        <Form layout="inline" onFinish={handleAddAvailability}>
                          <Form.Item name="dates" rules={[{ required: true }]}>
                            <RangePicker format="DD.MM.YYYY" />
                          </Form.Item>
                          <Form.Item name="type" initialValue="Отпуск">
                            <Select style={{ width: 150 }}>
                              <Select.Option value="Отпуск">Отпуск</Select.Option>
                              <Select.Option value="Больничный">Больничный</Select.Option>
                              <Select.Option value="Обучение">Обучение</Select.Option>
                            </Select>
                          </Form.Item>
                          <Form.Item>
                            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                              Добавить
                            </Button>
                          </Form.Item>
                        </Form>
                      </div>

                      <Table
                        dataSource={availability}
                        rowKey="id"
                        pagination={false}
                        columns={[
                          { title: 'Период', dataIndex: 'period', key: 'period' },
                          {
                            title: 'Тип',
                            dataIndex: 'type',
                            key: 'type',
                            render: (t) => (
                              <Tag color={t === 'Отпуск' ? 'green' : 'orange'}>{t}</Tag>
                            ),
                          },
                          {
                            title: 'Доступность (%)',
                            dataIndex: 'load_percent',
                            key: 'load_percent',
                            render: (val) => `${val}%`,
                          },
                          {
                            title: '',
                            key: 'action',
                            align: 'right',
                            render: () => (
                              <Button type="link" danger>
                                Удалить
                              </Button>
                            ),
                          },
                        ]}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
