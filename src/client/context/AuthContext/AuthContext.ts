import { Profile } from 'passport';
import { Profile as GithubProfile } from 'passport-github2';
import { createContext } from 'react';

export interface GoogleProfile extends Profile {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  language: string;
  picture: string;
  sub: string;
  verified: boolean;
}

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
  user: User | null;
  signup: (options: LocalLoginOptions) => Promise<void>;
  login: (options: LoginOptions) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextDefinition | null>(null);
