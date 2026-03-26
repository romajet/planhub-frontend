import { useState } from 'react';
import {
  Typography,
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Badge,
  Space,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
} from 'antd';
import {
  FolderOpenOutlined,
  DollarOutlined,
  ProjectOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const initialPortfolios = [
  {
    id: 'port_1',
    name: 'Цифровая трансформация',
    projectsTotal: 12,
    projectsActive: 8,
    budget: '150',
    spentPercent: 45,
    progress: 35,
    risk: 'normal',
    color: '#1677ff',
  },
  {
    id: 'port_2',
    name: 'Розничные продукты',
    projectsTotal: 5,
    projectsActive: 4,
    budget: '300',
    spentPercent: 85,
    progress: 60,
    risk: 'exception',
    color: '#cf1322',
  },
  {
    id: 'port_3',
    name: 'IT Инфраструктура',
    projectsTotal: 8,
    projectsActive: 2,
    budget: '80',
    spentPercent: 90,
    progress: 95,
    risk: 'success',
    color: '#3f8600',
  },
];

export const AdminPortfolios = () => {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState(initialPortfolios);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddPortfolio = (values: any) => {
    const newPortfolio = {
      id: `port_${Date.now()}`,
      name: values.name,
      projectsTotal: 0,
      projectsActive: 0,
      budget: values.budget.toString(),
      spentPercent: 0,
      progress: 0,
      risk: 'normal',
      color: '#722ed1', // Фиолетовый для новых портфелей
    };

    setPortfolios([newPortfolio, ...portfolios]);
    setIsModalVisible(false);
    form.resetFields();
    message.success(`Портфель "${values.name}" успешно создан!`);
  };

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
            Портфели проектов
          </Title>
          <Text type="secondary">Глобальный мониторинг направлений компании</Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<FolderOpenOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Создать портфель
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {portfolios.map((portfolio) => (
          <Col span={8} key={portfolio.id}>
            <Card
              hoverable
              variant="borderless"
              style={{ borderTop: `4px solid ${portfolio.color}` }}
              onClick={() => navigate('/projects')}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 16,
                }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  {portfolio.name}
                </Title>
                {portfolio.risk === 'exception' && (
                  <Badge count={<WarningOutlined style={{ color: '#f5222d', fontSize: 16 }} />} />
                )}
              </div>

              <Space size="large" style={{ width: '100%', marginBottom: 24 }}>
                <Statistic
                  title="Бюджет"
                  value={`${portfolio.budget} млн ₽`}
                  styles={{ content: { fontSize: 18, fontWeight: 600 } }}
                  prefix={<DollarOutlined />}
                />
                <Statistic
                  title="Проектов"
                  value={`${portfolio.projectsActive} / ${portfolio.projectsTotal}`}
                  styles={{ content: { fontSize: 18, fontWeight: 600 } }}
                  prefix={<ProjectOutlined />}
                />
              </Space>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text type="secondary">Освоение бюджета</Text>
                  <Text strong>{portfolio.spentPercent}%</Text>
                </div>
                <Progress
                  percent={portfolio.spentPercent}
                  showInfo={false}
                  status={portfolio.risk === 'exception' ? 'exception' : 'normal'}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text type="secondary">Общий прогресс</Text>
                  <Text strong>{portfolio.progress}%</Text>
                </div>
                <Progress percent={portfolio.progress} showInfo={false} strokeColor="#52c41a" />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Модалка создания портфеля */}
      <Modal
        title="Создать новый портфель проектов"
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText="Создать"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical" onFinish={handleAddPortfolio} style={{ marginTop: 20 }}>
          <Form.Item
            name="name"
            label="Название портфеля (Категория)"
            rules={[{ required: true, message: 'Обязательное поле' }]}
          >
            <Input placeholder="Например: Внутренние IT-продукты" />
          </Form.Item>
          <Form.Item
            name="budget"
            label="Выделенный бюджет (млн ₽)"
            rules={[{ required: true, message: 'Укажите бюджет' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="Например: 50" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
