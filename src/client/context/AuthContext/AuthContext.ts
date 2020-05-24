import { Profile as GithubProfile } from 'passport-github2';
import { createContext } from 'react';

import { GoogleProfile } from '../../../server/auth/provider/google/validator';

export type User = GithubProfile | GoogleProfile;

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
