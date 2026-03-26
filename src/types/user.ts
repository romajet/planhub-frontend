// Наши три основные роли из бизнес-требований
export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: Role;
  position?: string;
}
