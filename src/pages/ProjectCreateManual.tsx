import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Card,
  Typography,
  Row,
  Col,
  message,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

export const ProjectCreateManual = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const mutation = useMutation({
    mutationFn: async (newProjectData: any) => {
      await axios.post('/api/projects', newProjectData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      message.success('Проект успешно создан!');
      navigate('/projects');
    },
    onError: () => {
      message.error('Ошибка при создании проекта');
    },
  });

  const onFinish = (values: any) => {
    // Маппинг данных под ER-диаграмму (разделяем RangePicker на start и end)
    const formattedData = {
      name: values.name,
      category: values.category,
      description: values.description,
      goal: values.goal,
      planned_start: values.dateRange ? values.dateRange[0].format('YYYY-MM-DD') : null,
      planned_end: values.dateRange ? values.dateRange[1].format('YYYY-MM-DD') : null,
      status: values.status,
      manager_user_id: values.manager_user_id, // В реальности здесь будет ID, пока шлем имя
    };
    mutation.mutate(formattedData);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Создание проекта
        </Title>
        <Text type="secondary">Заполните паспорт проекта согласно корпоративному стандарту</Text>
      </div>

      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 'DRAFT' }}>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label="Название проекта"
                name="name"
                rules={[{ required: true, message: 'Укажите название' }]}
              >
                <Input size="large" placeholder="Например: Разработка нового модуля оплаты" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Портфель (category)"
                name="category"
                rules={[{ required: true, message: 'Выберите портфель' }]}
              >
                <Select size="large" placeholder="Выберите портфель">
                  <Select.Option value="Цифровая трансформация">
                    Цифровая трансформация
                  </Select.Option>
                  <Select.Option value="Розничные продукты">Розничные продукты</Select.Option>
                  <Select.Option value="IT Инфраструктура">IT Инфраструктура</Select.Option>
                  <Select.Option value="Маркетинг и PR">Маркетинг и PR</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Бизнес-цель (goal)" name="goal">
            <Input placeholder="Например: Увеличить конверсию в покупку на 15% к Q4" />
          </Form.Item>

          <Form.Item label="Описание и Scope (description)" name="description">
            <TextArea rows={4} placeholder="Опишите границы проекта, ключевые требования..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Сроки (planned_start - planned_end)"
                name="dateRange"
                rules={[{ required: true, message: 'Укажите сроки' }]}
              >
                <RangePicker size="large" style={{ width: '100%' }} format="DD.MM.YYYY" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Руководитель проекта"
                name="manager_user_id"
                rules={[{ required: true, message: 'Назначьте руководителя' }]}
              >
                <Select size="large" placeholder="Выберите сотрудника">
                  <Select.Option value="u3">Алексей Руководителев</Select.Option>
                  <Select.Option value="u5">Мария Дизайнерова</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Статус (status)" name="status">
                <Select size="large">
                  <Select.Option value="DRAFT">Черновик</Select.Option>
                  <Select.Option value="ACTIVE">В работе</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button
              size="large"
              onClick={() => navigate('/projects')}
              disabled={mutation.isPending}
            >
              Отмена
            </Button>
            <Button size="large" type="primary" htmlType="submit" loading={mutation.isPending}>
              Создать проект
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
