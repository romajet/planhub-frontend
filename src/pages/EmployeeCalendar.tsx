import { useState, useCallback } from 'react';
import {
  Typography,
  Card,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Space,
  Badge,
} from 'antd';
import { Calendar, dayjsLocalizer, Views, type View } from 'react-big-calendar';
import { PlusOutlined, CalendarOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useUiStore } from '../store/uiStore';

dayjs.locale('ru');
const localizer = dayjsLocalizer(dayjs);
const { Title, Text } = Typography;

type EventType = 'task' | 'meeting' | 'deadline' | 'vacation';

interface AppEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: EventType;
  taskId?: string;
}

export const EmployeeCalendar = () => {
  const { openTaskDrawer } = useUiStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.WEEK);

  const now = new Date();
  const [events, setEvents] = useState<AppEvent[]>([
    {
      id: '1',
      title: 'Разработать модуль авторизации',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0),
      type: 'task',
      taskId: 't_101',
    },
  ]);

  const eventPropGetter = (event: AppEvent) => {
    let backgroundColor = '#1677ff';
    if (event.type === 'meeting') backgroundColor = '#08979c';
    if (event.type === 'deadline') backgroundColor = '#cf1322';
    if (event.type === 'vacation') backgroundColor = '#52c41a';
    return { style: { backgroundColor, borderRadius: '4px', border: 'none', opacity: 0.9 } };
  };

  const dayPropGetter = (date: Date) => {
    const day = date.getDay();
    if (day === 0 || day === 6) return { style: { backgroundColor: '#f9f9f9' } };
    return {};
  };

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      form.setFieldsValue({
        dateRange: [dayjs(start), dayjs(end)],
        type: 'meeting',
        recurrence: 'none',
      });
      setIsModalVisible(true);
    },
    [form],
  );

  const handleSelectEvent = useCallback(
    (event: AppEvent) => {
      if (event.type === 'task' && event.taskId) openTaskDrawer(event.taskId);
      else message.info(`Событие: ${event.title}`);
    },
    [openTaskDrawer],
  );

  const handleAddEvent = (values: any) => {
    const newEvent: AppEvent = {
      id: `ev_${Date.now()}`,
      title:
        values.title +
        (values.recurrence !== 'none'
          ? ` (${values.recurrence === 'daily' ? 'Ежедневно' : 'Еженедельно'})`
          : ''),
      start: values.dateRange[0].toDate(),
      end: values.dateRange[1].toDate(),
      type: values.type,
    };
    setEvents([...events, newEvent]);
    setIsModalVisible(false);
    form.resetFields();
    message.success('Событие добавлено!');
  };

  // --- КАСТОМНЫЙ ТУЛБАР (Стрелочки < | Сегодня | > ) ---
  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => toolbar.onNavigate('PREV');
    const goToNext = () => toolbar.onNavigate('NEXT');
    const goToCurrent = () => toolbar.onNavigate('TODAY');

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Space size="small">
          <Button icon={<LeftOutlined />} onClick={goToBack} />
          <Button onClick={goToCurrent} style={{ fontWeight: 500 }}>
            Сегодня
          </Button>
          <Button icon={<RightOutlined />} onClick={goToNext} />
        </Space>
        <Text strong style={{ fontSize: 18, textTransform: 'capitalize' }}>
          {toolbar.label}
        </Text>
        <Space>
          <Button
            onClick={() => toolbar.onView('month')}
            type={toolbar.view === 'month' ? 'primary' : 'default'}
          >
            Месяц
          </Button>
          <Button
            onClick={() => toolbar.onView('week')}
            type={toolbar.view === 'week' ? 'primary' : 'default'}
          >
            Неделя
          </Button>
          <Button
            onClick={() => toolbar.onView('day')}
            type={toolbar.view === 'day' ? 'primary' : 'default'}
          >
            День
          </Button>
        </Space>
      </div>
    );
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Календарь
          </Title>
          <Text type="secondary">Управление расписанием и загрузкой</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => {
            form.setFieldsValue({ type: 'task', recurrence: 'none' });
            setIsModalVisible(true);
          }}
        >
          Добавить
        </Button>
      </div>

      <Card variant="borderless" styles={{ body: { padding: '24px' } }}>
        <Space size="large" style={{ marginBottom: 20 }}>
          <Badge color="#1677ff" text="Задачи" />
          <Badge color="#08979c" text="Встречи" />
          <Badge color="#cf1322" text="Дедлайны" />
          <Badge color="#52c41a" text="Отпуска" />
        </Space>

        <div style={{ height: '70vh' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            components={{ toolbar: CustomToolbar }} // ПОДКЛЮЧИЛИ ТУЛБАР
            date={currentDate}
            onNavigate={(newDate) => setCurrentDate(newDate)}
            view={currentView}
            onView={(newView) => setCurrentView(newView)}
            selectable={true}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventPropGetter}
            dayPropGetter={dayPropGetter}
            step={30}
            timeslots={2}
            min={new Date(0, 0, 0, 8, 0, 0)}
            max={new Date(0, 0, 0, 21, 0, 0)}
          />
        </div>
      </Card>

      <Modal
        title={
          <span>
            <CalendarOutlined /> Новое событие
          </span>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical" onFinish={handleAddEvent} style={{ marginTop: 16 }}>
          <Form.Item name="title" label="Название" rules={[{ required: true }]}>
            <Input placeholder="Например: Дейли митинг" />
          </Form.Item>

          <Space size="large" style={{ width: '100%', display: 'flex' }}>
            <Form.Item
              name="type"
              label="Тип события"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <Select>
                <Select.Option value="task">Задача (Синий)</Select.Option>
                <Select.Option value="meeting">Встреча (Голубой)</Select.Option>
                <Select.Option value="deadline">Дедлайн (Красный)</Select.Option>
                <Select.Option value="vacation">Отсутствие (Зеленый)</Select.Option>
              </Select>
            </Form.Item>

            {/* НОВОЕ ПОЛЕ: ПОВТОРЕНИЕ */}
            <Form.Item name="recurrence" label="Повторение" style={{ flex: 1 }}>
              <Select>
                <Select.Option value="none">Без повторения</Select.Option>
                <Select.Option value="daily">Каждый день</Select.Option>
                <Select.Option value="weekly">Каждую неделю</Select.Option>
              </Select>
            </Form.Item>
          </Space>

          <Form.Item name="dateRange" label="Дата и время" rules={[{ required: true }]}>
            <DatePicker.RangePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
