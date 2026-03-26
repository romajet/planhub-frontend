import { useState } from 'react';
import {
  Drawer,
  Typography,
  Tag,
  Space,
  Tabs,
  Button,
  Input,
  Upload,
  Avatar,
  List,
  Divider,
  message,
} from 'antd';
import {
  PaperClipOutlined,
  SendOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useUiStore } from '../store/uiStore';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Мок-данные, имитирующие таблицы TASK и TASK_REPORT из ER-диаграммы
const mockTaskDetail = {
  task_id: 't_101',
  title: 'Разработать модуль авторизации',
  description:
    'Необходимо реализовать JWT-авторизацию согласно новым требованиям безопасности. Подключить refresh-токены. См. ТЗ в базе знаний.',
  priority: 'HIGH',
  status: 'IN_PROGRESS',
  project_name: 'CRM для отдела продаж',
  sla_hours: 24,
  due_date: '2026-05-17',
  assignee: 'Иван Соколов',
};

const mockReports = [
  {
    report_id: 'r_1',
    author: 'Иван Соколов',
    text: 'Изучил документацию, подготовил структуру таблиц в БД.',
    created_at: '15.05.2026 14:30',
    attachments: [],
  },
];

export const TaskDrawer = () => {
  const { isTaskDrawerOpen, closeTaskDrawer, selectedTaskId } = useUiStore();
  const [reportText, setReportText] = useState('');

  const handleSendReport = () => {
    if (!reportText.trim()) return;
    message.success('Отчет отправлен на согласование руководителю!');
    setReportText('');
    closeTaskDrawer();
  };

  // В реальности здесь был бы хук useQuery для загрузки задачи по selectedTaskId

  return (
    <Drawer
      title={
        <Space>
          <Text type="secondary">#{mockTaskDetail.task_id}</Text>
          <Text>{mockTaskDetail.title}</Text>
        </Space>
      }
      placement="right"
      width={600}
      onClose={closeTaskDrawer}
      open={isTaskDrawerOpen}
      extra={
        <Button type="primary" onClick={handleSendReport}>
          Сдать на проверку
        </Button>
      }
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Шапка задачи */}
        <div
          style={{
            background: '#f8fafd',
            padding: 16,
            borderRadius: 8,
            border: '1px solid #e0e9f2',
          }}
        >
          <RowStats label="Проект" value={mockTaskDetail.project_name} />
          <RowStats
            label="Исполнитель"
            value={
              <Space>
                <Avatar size="small" icon={<UserOutlined />} /> {mockTaskDetail.assignee}
              </Space>
            }
          />
          <RowStats
            label="Приоритет"
            value={
              <Tag color={mockTaskDetail.priority === 'HIGH' ? 'red' : 'blue'}>
                {mockTaskDetail.priority}
              </Tag>
            }
          />
          <RowStats
            label="Дедлайн"
            value={
              <Text type="danger">
                <ClockCircleOutlined /> до {mockTaskDetail.due_date}
              </Text>
            }
          />
          <RowStats label="SLA" value={`${mockTaskDetail.sla_hours} часов`} />
        </div>

        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: 'Описание',
              children: (
                <div>
                  <Title level={5}>Суть задачи</Title>
                  <Paragraph style={{ fontSize: 15, lineHeight: 1.6 }}>
                    {mockTaskDetail.description}
                  </Paragraph>
                  <Divider />
                  <Title level={5}>Чеклист (TASK_CHECKLIST_ITEM)</Title>
                  <Space direction="vertical">
                    <Text>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} /> Создать таблицу
                      пользователей
                    </Text>
                    <Text>
                      <ClockCircleOutlined style={{ color: '#bfbfbf' }} /> Настроить генерацию JWT
                    </Text>
                    <Text>
                      <ClockCircleOutlined style={{ color: '#bfbfbf' }} /> Написать тесты
                    </Text>
                  </Space>
                </div>
              ),
            },
            {
              key: '2',
              label: 'Отчеты и Файлы',
              children: (
                <div>
                  <List
                    itemLayout="horizontal"
                    dataSource={mockReports}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={
                            <Space>
                              <Text strong>{item.author}</Text>{' '}
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {item.created_at}
                              </Text>
                            </Space>
                          }
                          description={item.text}
                        />
                      </List.Item>
                    )}
                  />
                  <div
                    style={{
                      marginTop: 24,
                      background: '#f0f7ff',
                      padding: 16,
                      borderRadius: 8,
                      border: '1px solid #c0d0e5',
                    }}
                  >
                    <Title level={5} style={{ marginTop: 0, color: '#1e3a5f' }}>
                      Добавить отчет о работе
                    </Title>
                    <TextArea
                      rows={3}
                      placeholder="Опишите, что было сделано..."
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      style={{ marginBottom: 12 }}
                    />
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Upload showUploadList={false}>
                        <Button icon={<PaperClipOutlined />}>Прикрепить файл</Button>
                      </Upload>
                      <Button type="primary" icon={<SendOutlined />} onClick={handleSendReport}>
                        Отправить
                      </Button>
                    </Space>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </Space>
    </Drawer>
  );
};

// Вспомогательный компонент для красивого вывода ключ-значение
const RowStats = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
    <Text type="secondary">{label}:</Text>
    <Text strong>{value}</Text>
  </div>
);
