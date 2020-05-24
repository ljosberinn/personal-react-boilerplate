import { createContext } from 'react';

export interface User {
  name: string;
}

export type Provider = 'github' | 'google' | 'local';

export interface ExternalLoginOptions {
  provider: Provider;
}

export interface LocalLoginOptions {
  username: string;
  password: string;
}

export type LoginOptions = ExternalLoginOptions | LocalLoginOptions;

export interface AuthContextDefinition {
  login: (options: LoginOptions) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  user: User | null;
}

export const AuthContext = createContext<AuthContextDefinition | null>(null);
