import { createContext } from 'react';

export interface User {
  name: string;
}

interface AuthContextDefinition {
  login: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  user: User | null;
}

export const AuthContext = createContext<AuthContextDefinition | null>(null);
