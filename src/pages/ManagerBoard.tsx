import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import {
  Card,
  Typography,
  Tag,
  Avatar,
  Button,
  Select,
  Badge,
  Tooltip,
  Modal,
  Form,
  Input,
  message,
  DatePicker,
  InputNumber,
} from 'antd';
import { UserOutlined, PlusOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';

const { Title, Text } = Typography;

interface Task {
  id: string;
  content: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  assignee?: string;
  isNewReview?: boolean;
}

const initialColumns = {
  BACKLOG: {
    name: 'Бэклог (Ожидают)',
    items: [
      { id: 't-1', content: 'Спроектировать API для модуля аналитики', priority: 'HIGH' },
      { id: 't-2', content: 'Обновить дизайн страницы профиля', priority: 'MEDIUM' },
    ] as Task[],
  },
  IN_PROGRESS: {
    name: 'В работе',
    items: [
      { id: 't-3', content: 'Настроить CI/CD пайплайн', priority: 'HIGH', assignee: 'Иван Иванов' },
    ] as Task[],
  },
  REVIEW: {
    name: 'На проверке',
    items: [
      {
        id: 't-4',
        content: 'Сверстать окно авторизации',
        priority: 'MEDIUM',
        assignee: 'Анна Смирнова',
        isNewReview: true,
      },
    ] as Task[],
  },
  DONE: {
    name: 'Выполненные',
    items: [
      {
        id: 't-5',
        content: 'Настройка базы данных PostgreSQL',
        priority: 'HIGH',
        assignee: 'Иван Иванов',
      },
    ] as Task[],
  },
};

export const ManagerBoard = () => {
  const [columns, setColumns] = useState(initialColumns);
  const { currentProjectId } = useAuthStore();

  // --- НОВЫЕ СОСТОЯНИЯ ДЛЯ ФОРМЫ СОЗДАНИЯ ЗАДАЧИ ---
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId as keyof typeof columns];
      const destColumn = columns[destination.droppableId as keyof typeof columns];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];

      const [removed] = sourceItems.splice(source.index, 1);

      const updatedTask = { ...removed };
      if (source.droppableId === 'REVIEW') updatedTask.isNewReview = false;
      if (destination.droppableId === 'REVIEW') updatedTask.isNewReview = true;

      destItems.splice(destination.index, 0, updatedTask);

      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems },
      });
    } else {
      const column = columns[source.droppableId as keyof typeof columns];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: { ...column, items: copiedItems },
      });
    }
  };

  // --- ОБРАБОТЧИК ДОБАВЛЕНИЯ НОВОЙ ЗАДАЧИ ---
  const handleAddTask = (values: any) => {
    const newTask: Task = {
      id: `t-${Date.now().toString().slice(-4)}`, // Генерируем уникальный ID (последние 4 цифры времени)
      content: values.content,
      priority: values.priority,
      assignee: values.assignee,
    };

    // Обновляем состояние, добавляя задачу в конец массива Бэклога
    setColumns((prev) => ({
      ...prev,
      BACKLOG: {
        ...prev.BACKLOG,
        items: [...prev.BACKLOG.items, newTask],
      },
    }));

    setIsModalVisible(false);
    form.resetFields();
    message.success('Задача успешно добавлена в Бэклог!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
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
            Дашборд задач проекта
          </Title>
          <Text type="secondary">ID текущего проекта: {currentProjectId || 'Не выбран'}</Text>
        </div>
        {/* ОЖИВЛЯЕМ КНОПКУ */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setIsModalVisible(true)}
        >
          Добавить задачу
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: 16 }}>
          {Object.entries(columns).map(([columnId, column]) => (
            <div
              key={columnId}
              style={{ display: 'flex', flexDirection: 'column', minWidth: 280, flex: 1 }}
            >
              <div
                style={{
                  background: '#fafafa',
                  padding: '12px 16px',
                  borderRadius: '8px 8px 0 0',
                  border: '1px solid #f0f0f0',
                  borderBottom: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Text strong>{column.name}</Text>
                <Tag color="blue" style={{ margin: 0 }}>
                  {column.items.length}
                </Tag>
              </div>

              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: snapshot.isDraggingOver ? '#e6f4ff' : '#f5f5f5',
                      padding: 12,
                      flexGrow: 1,
                      minHeight: 400,
                      border: '1px solid #f0f0f0',
                      borderTop: 'none',
                      borderRadius: '0 0 8px 8px',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => {
                          const CardInner = () => (
                            <Card
                              size="small"
                              variant="borderless"
                              style={{
                                background: '#fff',
                                boxShadow: snapshot.isDragging
                                  ? '0 8px 16px rgba(0,0,0,0.1)'
                                  : '0 2px 4px rgba(0,0,0,0.02)',
                                transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
                                transition: 'box-shadow 0.2s, transform 0.2s',
                              }}
                            >
                              <div
                                style={{
                                  marginBottom: 8,
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Tag
                                  color={
                                    item.priority === 'HIGH'
                                      ? 'red'
                                      : item.priority === 'MEDIUM'
                                        ? 'orange'
                                        : 'blue'
                                  }
                                >
                                  {item.priority}
                                </Tag>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {item.id}
                                </Text>
                              </div>
                              <Text strong style={{ display: 'block', marginBottom: 16 }}>
                                {item.content}
                              </Text>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                {columnId === 'BACKLOG' ? (
                                  <Select
                                    size="small"
                                    placeholder="Назначить"
                                    variant="borderless"
                                    style={{ width: 120, background: '#f0f0f0', borderRadius: 4 }}
                                    value={item.assignee}
                                  >
                                    <Select.Option value="Иван Иванов">Иван И.</Select.Option>
                                    <Select.Option value="Анна Смирнова">Анна С.</Select.Option>
                                  </Select>
                                ) : (
                                  <Tooltip title={item.assignee || 'Не назначен'}>
                                    <Avatar
                                      size="small"
                                      icon={<UserOutlined />}
                                      style={{ background: item.assignee ? '#1677ff' : '#ccc' }}
                                    />
                                  </Tooltip>
                                )}
                                {columnId !== 'DONE' && (
                                  <Tooltip title="Оценка времени: 8ч">
                                    <ClockCircleOutlined
                                      style={{ color: '#bfbfbf', cursor: 'help' }}
                                    />
                                  </Tooltip>
                                )}
                              </div>
                            </Card>
                          );

                          return (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: 'none',
                                marginBottom: 12,
                                ...provided.draggableProps.style,
                              }}
                            >
                              {item.isNewReview ? (
                                <Badge.Ribbon text="New" color="red">
                                  <CardInner />
                                </Badge.Ribbon>
                              ) : (
                                <CardInner />
                              )}
                            </div>
                          );
                        }}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* --- МОДАЛЬНОЕ ОКНО СОЗДАНИЯ ЗАДАЧИ (По ER-диаграмме) --- */}
      <Modal
        title="✨ Создать новую задачу"
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText="Создать задачу"
        cancelText="Отмена"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddTask}
          style={{ marginTop: 20 }}
          initialValues={{ priority: 'MEDIUM', task_type: 'feature' }}
        >
          <Form.Item
            name="title"
            label="Краткое название (title)"
            rules={[{ required: true, message: 'Обязательное поле' }]}
          >
            <Input placeholder="Например: Интеграция API оплат" />
          </Form.Item>

          <Form.Item name="content" label="Подробное описание (description)">
            <Input.TextArea rows={3} placeholder="Суть задачи, ссылки на макеты..." />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="task_type" label="Тип (task_type)" style={{ flex: 1 }}>
              <Select>
                <Select.Option value="feature">Доработка (Feature)</Select.Option>
                <Select.Option value="bug">Ошибка (Bug)</Select.Option>
                <Select.Option value="research">Аналитика (Research)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="priority" label="Приоритет (priority)" style={{ flex: 1 }}>
              <Select>
                <Select.Option value="HIGH">
                  <Tag color="red">Высокий</Tag>
                </Select.Option>
                <Select.Option value="MEDIUM">
                  <Tag color="orange">Средний</Tag>
                </Select.Option>
                <Select.Option value="LOW">
                  <Tag color="blue">Низкий</Tag>
                </Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="assignee" label="Исполнитель (assignee_user_id)" style={{ flex: 1 }}>
              <Select placeholder="Не назначен" allowClear>
                <Select.Option value="Иван Иванов">Иван Иванов</Select.Option>
                <Select.Option value="Анна Смирнова">Анна Смирнова</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="due_date" label="Дедлайн (due_date)" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
            </Form.Item>

            <Form.Item name="sla_hours" label="SLA (часы)" style={{ width: 120 }}>
              <InputNumber min={1} max={999} style={{ width: '100%' }} placeholder="Напр. 8" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
