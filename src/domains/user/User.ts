export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  currency: string;
  notificationEnabled: boolean;
}