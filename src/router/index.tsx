import { createBrowserRouter } from 'react-router-dom';
import { Login } from '../pages/Login';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Dashboard } from '../pages/Dashboard';
import { ProjectsList } from '../pages/ProjectsList';
// import { ProjectImportWizard } from '../pages/ProjectImportWizard';
// import { AiTeamMatch } from '../pages/AiTeamMatch';
import { TasksList } from '../pages/TasksList';
import { ProjectDashboard } from '../pages/ProjectDashboard';
import { KnowledgeBase } from '../pages/KnowledgeBase';
import { WorkflowEditor } from '../pages/WorkflowEditor';
// import { ProjectCreateManual } from '../pages/ProjectCreateManual';
import { ManagerBoard } from '../pages/ManagerBoard';
import { TeamManagement } from '../pages/TeamManagement';
import { EmployeeCalendar } from '../pages/EmployeeCalendar';
import { EmployeeReports } from '../pages/EmployeeReports';
import { CompanyStructure } from '../pages/CompanyStructure';
import { AdminReports } from '../pages/AdminReports';
// import { AdminEmployees } from '../pages/AdminEmployees';
import { AdminSettings } from '../pages/AdminSettings';
// import { UnderConstruction } from '../pages/UnderConstruction';
import { Backlog } from '../pages/Backlog';
import { UserProfile } from '../pages/UserProfile';
import { ProjectWizard } from '../pages/ProjectWizard';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    // Оборачиваем всю приватную часть в наш ProtectedRoute
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />, // MainLayout будет оболочкой для всех страниц ниже
        children: [
          {
            index: true, // Это маршрут по умолчанию (ЛК / Дашборд)
            element: <Dashboard />,
          },
          {
            path: 'projects',
            element: <ProjectsList />,
          },
          // {
          //   path: 'projects/import-ai', // <-- 2. Добавляем путь для визарда
          //   element: <ProjectImportWizard />,
          // },
          // { path: 'projects/ai-team-match', element: <AiTeamMatch /> },
          // { path: 'projects/new', element: <ProjectCreateManual /> },
          { path: 'projects/new', element: <ProjectWizard /> },
          { path: 'projects/:id', element: <ProjectDashboard /> },
          { path: 'tasks', element: <TasksList /> }, // Старый список для сотрудника
          { path: 'board', element: <ManagerBoard /> }, // Новая доска для Руководителя
          { path: 'team', element: <TeamManagement /> },
          { path: 'calendar', element: <EmployeeCalendar /> },
          { path: 'reports', element: <EmployeeReports /> },
          { path: 'structure', element: <CompanyStructure /> },
          { path: 'portfolio-reports', element: <AdminReports /> },
          { path: 'knowledge/docs', element: <KnowledgeBase /> },
          { path: 'workflows', element: <WorkflowEditor /> },
          // { path: 'employees', element: <AdminEmployees /> },
          { path: 'settings', element: <AdminSettings /> },

          { path: 'profile', element: <UserProfile /> },
          { path: 'backlog', element: <Backlog /> },
          { path: 'knowledge/:category', element: <KnowledgeBase /> },
        ],
      },
    ],
  },
]);
