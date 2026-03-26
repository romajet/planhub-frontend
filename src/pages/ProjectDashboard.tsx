import { useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Progress,
  Row,
  Col,
  Timeline,
  Avatar,
  Spin,
  Divider,
  message,
} from 'antd';
import {
  FileTextOutlined,
  RobotOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

// Мок-данные для отчетов сотрудников
const recentReports = [
  {
    id: 'r1',
    user: 'Иван Иванов',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
    task: 'Сверстать окно авторизации',
    time: '2 часа назад',
    comment: 'Сделал форму, прикрутил Zustand. Ссылка на PR: github.com/...',
  },
  {
    id: 'r2',
    user: 'Анна Смирнова',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
    task: 'Настроить БД',
    time: 'Вчера',
    comment: 'Таблицы созданы, миграции прошли успешно.',
  },
];

export const ProjectDashboard = () => {
  const { id } = useParams(); // Получаем ID проекта из URL
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Имитация работы ИИ
  const generateAiReport = () => {
    setIsGenerating(true);
    setAiReport(null);

    setTimeout(() => {
      setAiReport(
        'Проект идет с опережением графика на 5%. ' +
          'За последние 48 часов успешно закрыты ключевые задачи по фронтенду (окно авторизации) и бэкенду (база данных). ' +
          'Рисков не выявлено. Рекомендуется перевести задачу "Интеграция с 1С" в статус "В работе", ' +
          'так как Анна Смирнова освободилась.',
      );
      setIsGenerating(false);
      message.success('ИИ-отчет успешно сгенерирован!');
    }, 2500);
  };

  return (
    <div>
      {/* Шапка проекта */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
        }}
      >
        <div>
          <Space align="center">
            <Title level={2} style={{ margin: 0 }}>
              CRM для отдела продаж
            </Title>
            <Tag color="green">В работе</Tag>
          </Space>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            ID Проекта: {id} | Дедлайн: 01.08.2026
          </Text>
        </div>
        <Button
          type="primary"
          icon={<RobotOutlined />}
          size="large"
          loading={isGenerating}
          onClick={generateAiReport}
        >
          Сгенерировать статус-репорт
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Метрики проекта */}
        <Col span={24}>
          <Card variant="borderless">
            <Row gutter={48}>
              <Col span={8}>
                <Text type="secondary">Общий прогресс</Text>
                <Progress percent={75} status="active" strokeColor="#1677ff" />
              </Col>
              <Col span={8}>
                <Text type="secondary">Освоено бюджета / часов</Text>
                <Title level={4} style={{ margin: 0 }}>
                  120 / 160 ч.
                </Title>
              </Col>
              <Col span={8}>
                <Text type="secondary">Ближайший майлстоун</Text>
                <Title level={4} style={{ margin: 0 }}>
                  Релиз MVP (Через 14 дней)
                </Title>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Таймлайн отчетов (Левая колонка) */}
        <Col span={14}>
          <Card
            title="Последние отчеты сотрудников"
            variant="borderless"
            style={{ minHeight: 400 }}
          >
            <Timeline
              items={recentReports.map((report) => ({
                dot: <CheckCircleOutlined style={{ fontSize: '16px', color: '#52c41a' }} />,
                children: (
                  <>
                    <Space style={{ marginBottom: 8 }}>
                      <Avatar src={report.avatar} size="small" />
                      <Text strong>{report.user}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        {report.time}
                      </Text>
                    </Space>
                    <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 8 }}>
                      <Text strong style={{ display: 'block' }}>
                        Задача: {report.task}
                      </Text>
                      <Text>{report.comment}</Text>
                    </div>
                  </>
                ),
              }))}
            />
          </Card>
        </Col>

        {/* Блок с ИИ-отчетом (Правая колонка) */}
        <Col span={10}>
          <Card
            title={
              <span>
                <RobotOutlined style={{ color: '#1677ff', marginRight: 8 }} /> ИИ-Сводка для
                руководства
              </span>
            }
            variant="borderless"
            style={{ minHeight: 400, background: '#e6f4ff' }}
          >
            {isGenerating ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
                <Paragraph style={{ marginTop: 16 }}>
                  <Text type="secondary">ИИ читает отчеты и анализирует сроки...</Text>
                </Paragraph>
              </div>
            ) : aiReport ? (
              <div>
                <Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>{aiReport}</Paragraph>
                <Divider />
                <Button type="primary" ghost icon={<FileTextOutlined />}>
                  Скопировать для письма
                </Button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <FileTextOutlined style={{ fontSize: 48, color: '#bfbfbf', marginBottom: 16 }} />
                <Paragraph>
                  <Text type="secondary">
                    Нажмите кнопку в шапке, чтобы сгенерировать автоматический отчет на основе
                    последних данных.
                  </Text>
                </Paragraph>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
