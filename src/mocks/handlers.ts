import { http, HttpResponse, delay } from 'msw';

// Те самые данные, которые раньше лежали прямо в компоненте
let mockProjects = [
  {
    id: 'p_1',
    name: 'CRM для отдела продаж',
    status: 'ACTIVE',
    manager: 'Алексей Руководителев',
    progress: 75,
    deadline: '2026-08-01',
  },
  {
    id: 'p_2',
    name: 'Редизайн корпоративного сайта',
    status: 'DELAYED',
    manager: 'Мария Дизайнерова',
    progress: 30,
    deadline: '2026-05-15',
  },
  {
    id: 'p_3',
    name: 'Интеграция складского API',
    status: 'DRAFT',
    manager: 'Иван Иванов',
    progress: 0,
    deadline: '2026-12-01',
  },
];

let mockTasks = [
  {
    id: 't1',
    title: 'Сверстать окно авторизации',
    project: 'CRM для отдела продаж',
    priority: 'HIGH',
    status: 'TODO',
  },
  {
    id: 't2',
    title: 'Настроить Zustand',
    project: 'CRM для отдела продаж',
    priority: 'MEDIUM',
    status: 'TODO',
  },
  {
    id: 't3',
    title: 'Анализ API',
    project: 'Интеграция с 1С',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
  },
];

export const handlers = [
  // Получение проектов
  http.get('/api/projects', async () => {
    await delay(800);
    return HttpResponse.json(mockProjects);
  }),

  // --- НОВЫЙ ЭНДПОИНТ: Создание проекта ---
  http.post('/api/projects', async ({ request }) => {
    await delay(600); // Имитация загрузки
    const body = (await request.json()) as any;

    // Формируем новый проект (генерируем ID и ставим нулевой прогресс)
    const newProject = {
      id: `p_${Date.now()}`,
      name: body.name,
      status: body.status || 'DRAFT',
      manager: body.manager,
      progress: 0,
      deadline: body.deadline,
    };

    // Добавляем в нашу "БД"
    mockProjects.push(newProject);

    // Возвращаем успешный ответ
    return HttpResponse.json(newProject, { status: 201 });
  }),

  // 1. Получение списка задач
  http.get('/api/tasks', async () => {
    await delay(500);
    return HttpResponse.json(mockTasks);
  }),

  // 2. Обновление статуса задачи (PATCH запрос)
  http.patch('/api/tasks/:id', async ({ request, params }) => {
    await delay(500);
    const { id } = params;

    // Читаем новый статус из тела запроса
    const body = (await request.json()) as { status: string };

    // Находим и обновляем задачу в нашей "базе данных"
    mockTasks = mockTasks.map((task) => (task.id === id ? { ...task, status: body.status } : task));

    return HttpResponse.json({ success: true });
  }),

  // 2. Эндпоинт для авторизации (задел на будущее)
  http.post('/api/login', async ({ request }) => {
    // Читаем email/пароль из тела запроса
    await request.json();

    // Возвращаем фейкового юзера и токен
    return HttpResponse.json({
      user: {
        id: 'u_123',
        fullName: 'Алексей Руководителев',
        role: 'MANAGER',
      },
      token: 'fake-jwt-token-12345',
    });
  }),
];
