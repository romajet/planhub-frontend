import { useState } from 'react';
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Avatar,
  Badge,
  Space,
  Typography,
  theme,
  Select,
  Tag,
  Popover,
  List,
  message,
  Tooltip,
} from 'antd';
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  CheckSquareOutlined,
  LineChartOutlined,
  NodeIndexOutlined,
  TeamOutlined,
  ApartmentOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { Role } from '../types/user';
import { TaskDrawer } from '../components/TaskDrawer';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, switchRole, currentProjectId, setCurrentProjectId } = useAuthStore();
  const { token } = theme.useToken();

  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Новая задача',
      desc: 'Вам назначена задача "Сверстать окно авторизации"',
      time: '10 мин назад',
      unread: true,
    },
  ]);

  const triggerTestNotification = () => {
    setNotifications([
      {
        id: Date.now().toString(),
        title: 'Системное уведомление',
        desc: 'Тестовый пинг системы.',
        time: 'Только что',
        unread: true,
      },
      ...notifications,
    ]);
    message.info('Получено новое уведомление!');
  };

  const markAllAsRead = () => setNotifications(notifications.map((n) => ({ ...n, unread: false })));

  const notificationContent = (
    <div style={{ width: 320 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
          paddingBottom: 8,
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Text strong>Уведомления</Text>
        <Button type="link" size="small" onClick={markAllAsRead}>
          Прочитать все
        </Button>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        locale={{ emptyText: 'Нет новых уведомлений' }}
        renderItem={(item) => (
          <List.Item
            style={{
              opacity: item.unread ? 1 : 0.6,
              background: item.unread ? '#f0f7ff' : 'transparent',
              padding: '8px 12px',
              borderRadius: 6,
              marginBottom: 4,
            }}
          >
            <List.Item.Meta
              avatar={
                <CheckCircleOutlined
                  style={{ color: item.unread ? '#1677ff' : '#bfbfbf', marginTop: 6 }}
                />
              }
              title={<Text strong={item.unread}>{item.title}</Text>}
              description={
                <div>
                  <Text style={{ fontSize: 13, display: 'block' }}>{item.desc}</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {item.time}
                  </Text>
                </div>
              }
            />
          </List.Item>
        )}
        style={{ maxHeight: 300, overflowY: 'auto' }}
      />
    </div>
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Личный кабинет',
        onClick: () => navigate('/profile'),
      },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Выйти', onClick: handleLogout },
    ],
  };

  const employeeMenu = [
    { key: '/tasks', icon: <CheckSquareOutlined />, label: 'Задачи' },
    { key: '/reports', icon: <LineChartOutlined />, label: 'Отчет по проекту' },
  ];

  const managerMenu = [
    {
      key: 'tasks-group',
      icon: <CheckSquareOutlined />,
      label: 'Задачи',
      children: [
        { key: '/board', label: '📊 Дашборд задач' },
        { key: '/backlog', label: '📌 Бэклог' },
      ],
    },
    { key: '/workflows', icon: <NodeIndexOutlined />, label: 'WorkFlow' },
    { key: '/team', icon: <TeamOutlined />, label: 'Команда' },
    { key: '/reports', icon: <LineChartOutlined />, label: 'Отчет по проекту' },
  ];

  const adminMenu = [
    { key: '/portfolio-reports', icon: <BarChartOutlined />, label: 'Отчеты по проектам' },
    { key: '/structure', icon: <ApartmentOutlined />, label: 'Структура компании' },
    { key: '/projects', icon: <UnorderedListOutlined />, label: 'Все проекты' },
    { key: '/settings', icon: <SettingOutlined />, label: 'Настройки системы' },
  ];

  const activeMenu =
    user?.role === 'ADMIN' ? adminMenu : user?.role === 'MANAGER' ? managerMenu : employeeMenu;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="light" width={240}>
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Text strong style={{ fontSize: collapsed ? 12 : 16, color: token.colorPrimary }}>
            {collapsed
              ? 'PH'
              : user?.role === 'ADMIN'
                ? 'Администратор'
                : user?.role === 'MANAGER'
                  ? 'Руководитель'
                  : 'Сотрудник'}
          </Text>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={activeMenu}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: token.colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <div>
            {user?.role === 'ADMIN' ? (
              <Text strong style={{ fontSize: 22, letterSpacing: 1 }}>
                PlanHub
              </Text>
            ) : (
              <Space size="large">
                <Button
                  type="text"
                  icon={<HomeOutlined />}
                  onClick={() => navigate('/')}
                  style={{ fontWeight: 500 }}
                >
                  На главную
                </Button>
                <Space>
                  <Text type="secondary">Проект:</Text>
                  <Select
                    value={currentProjectId}
                    onChange={setCurrentProjectId}
                    style={{ width: 280 }}
                    popupMatchSelectWidth={false}
                    options={[
                      {
                        value: 'p_1',
                        label: (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span>Альфа (CRM)</span>
                            <Tag color="blue" style={{ margin: 0 }}>
                              Руководитель
                            </Tag>
                          </div>
                        ),
                      },
                      {
                        value: 'p_2',
                        label: (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span>Бета (Сайт)</span>
                            <Tag color="cyan" style={{ margin: 0 }}>
                              Разработчик
                            </Tag>
                          </div>
                        ),
                      },
                    ]}
                  />
                </Space>
              </Space>
            )}
          </div>

          <Space size="large">
            <div
              style={{
                display: 'flex',
                gap: 8,
                background: '#fffbe6',
                padding: '4px 12px',
                borderRadius: 4,
                border: '1px solid #ffe58f',
                alignItems: 'center',
              }}
            >
              <Text type="warning" strong>
                Dev:
              </Text>
              <Select
                value={user?.role}
                onChange={(value: string) => switchRole(value as Role)}
                style={{ width: 130 }}
                size="small"
                options={[
                  { value: 'ADMIN', label: 'Админ' },
                  { value: 'MANAGER', label: 'Руководитель' },
                  { value: 'EMPLOYEE', label: 'Сотрудник' },
                ]}
              />
              <Button size="small" type="primary" ghost onClick={triggerTestNotification}>
                🔔 Тест
              </Button>
            </div>

            <Tooltip title="Календарь">
              <Button
                type="text"
                shape="circle"
                icon={<CalendarOutlined style={{ fontSize: 18 }} />}
                onClick={() => navigate('/calendar')}
              />
            </Tooltip>

            <Popover content={notificationContent} trigger="click" placement="bottomRight">
              <Badge count={notifications.filter((n) => n.unread).length} size="small">
                <Button
                  type="text"
                  shape="circle"
                  icon={<BellOutlined style={{ fontSize: 18 }} />}
                />
              </Badge>
            </Popover>

            <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
              <Space
                style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}
                className="user-profile-hover"
              >
                <Text strong>{user?.fullName || 'Пользователь'}</Text>
                <Avatar icon={<UserOutlined />} src={user?.avatarUrl} />
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px',
            background: token.colorBgContainer,
            borderRadius: token.borderRadius,
            padding: 24,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
      <TaskDrawer />
    </Layout>
  );
};
