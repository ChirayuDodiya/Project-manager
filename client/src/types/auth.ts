export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'developer';
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}
