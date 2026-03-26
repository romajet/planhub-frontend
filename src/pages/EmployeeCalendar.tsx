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
import { PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ru'; // Русская локаль для старта недели с понедельника
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useUiStore } from '../store/uiStore';

// Настраиваем локализатор для календаря
dayjs.locale('ru');
const localizer = dayjsLocalizer(dayjs);

const { Title, Text } = Typography;

// Типы событий
type EventType = 'task' | 'meeting' | 'deadline' | 'vacation';

interface AppEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: EventType;
  taskId?: string; // Привязка к реальной задаче в БД
}

// Перевод кнопок календаря на русский
const calendarMessages = {
  allDay: 'Весь день',
  previous: 'Назад',
  next: 'Вперед',
  today: 'Сегодня',
  month: 'Месяц',
  week: 'Неделя',
  day: 'День',
  agenda: 'Расписание',
  date: 'Дата',
  time: 'Время',
  event: 'Событие',
  noEventsInRange: 'Нет событий в этом диапазоне.',
  showMore: (total: number) => `+ Ещё (${total})`,
};

export const EmployeeCalendar = () => {
  const { openTaskDrawer } = useUiStore(); // Достаем функцию открытия глобального сайдбара
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ start: Date; end: Date } | null>(null);
  const [form] = Form.useForm();

  // --- НОВЫЕ СОСТОЯНИЯ ДЛЯ НАВИГАЦИИ ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.WEEK);

  // Мок-данные (Привязываем к текущей дате для наглядности)
  const now = new Date();
  const [events, setEvents] = useState<AppEvent[]>([
    {
      id: '1',
      title: 'Разработать модуль авторизации',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0),
      type: 'task',
      taskId: 't_101', // ID задачи, чтобы открыть её в сайдбаре
    },
    {
      id: '2',
      title: 'Daily Meeting',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 30),
      type: 'meeting',
    },
    {
      id: '3',
      title: 'Релиз MVP',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 18, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 19, 0),
      type: 'deadline',
    },
  ]);

  // --- КАСТОМИЗАЦИЯ ВНЕШНЕГО ВИДА ---

  // 1. Цвета карточек событий
  const eventPropGetter = (event: AppEvent) => {
    let backgroundColor = '#1677ff'; // Синий по умолчанию (задачи)
    if (event.type === 'meeting') backgroundColor = '#08979c'; // Голубой
    if (event.type === 'deadline') backgroundColor = '#cf1322'; // Красный
    if (event.type === 'vacation') backgroundColor = '#52c41a'; // Зеленый

    return { style: { backgroundColor, borderRadius: '4px', border: 'none', opacity: 0.9 } };
  };

  // 2. Выделение выходных дней серым цветом
  const dayPropGetter = (date: Date) => {
    const day = date.getDay();
    // 0 - Воскресенье, 6 - Суббота
    if (day === 0 || day === 6) {
      return { style: { backgroundColor: '#f9f9f9' } };
    }
    return {};
  };

  // --- ОБРАБОТЧИКИ ДЕЙСТВИЙ ---

  // Клик по пустой ячейке (как в Google Calendar)
  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      setSelectedDates({ start, end });
      form.setFieldsValue({
        dateRange: [dayjs(start), dayjs(end)],
        type: 'meeting',
      });
      setIsModalVisible(true);
    },
    [form],
  );

  // Клик по самому событию
  const handleSelectEvent = useCallback(
    (event: AppEvent) => {
      if (event.type === 'task' && event.taskId) {
        openTaskDrawer(event.taskId); // Открываем сайдбар задачи!
      } else {
        message.info(`Событие: ${event.title}`);
      }
    },
    [openTaskDrawer],
  );

  // Сохранение нового события из модалки
  const handleAddEvent = (values: any) => {
    const newEvent: AppEvent = {
      id: `ev_${Date.now()}`,
      title: values.title,
      start: values.dateRange[0].toDate(),
      end: values.dateRange[1].toDate(),
      type: values.type,
    };
    setEvents([...events, newEvent]);
    setIsModalVisible(false);
    form.resetFields();
    message.success('Событие добавлено!');
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
            form.setFieldsValue({ type: 'task' });
            setIsModalVisible(true);
          }}
        >
          Добавить
        </Button>
      </div>

      <Card variant="borderless" styles={{ body: { padding: '24px' } }}>
        {/* Легенда */}
        <Space size="large" style={{ marginBottom: 20 }}>
          <Badge color="#1677ff" text="Задачи" />
          <Badge color="#08979c" text="Встречи" />
          <Badge color="#cf1322" text="Дедлайны" />
          <Badge color="#52c41a" text="Отпуска" />
        </Space>

        {/* Сам Календарь */}
        <div style={{ height: '70vh' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            messages={calendarMessages}
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            // --- ЯВНОЕ УПРАВЛЕНИЕ НАВИГАЦИЕЙ ---
            date={currentDate}
            onNavigate={(newDate) => setCurrentDate(newDate)}
            view={currentView}
            onView={(newView) => setCurrentView(newView)}
            // -----------------------------------

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

      {/* Модальное окно добавления */}
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

          <Form.Item name="type" label="Тип события" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="task">Задача (Синий)</Select.Option>
              <Select.Option value="meeting">Встреча (Голубой)</Select.Option>
              <Select.Option value="deadline">Дедлайн (Красный)</Select.Option>
              <Select.Option value="vacation">Отсутствие (Зеленый)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="dateRange" label="Дата и время" rules={[{ required: true }]}>
            {/* В Ant Design нет удобного встроенного RangePicker для дат+времени без костылей, 
                 поэтому для простоты оставляем базовый выбор дат, но ИИ поймет, что это диапазон */}
            <DatePicker.RangePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
