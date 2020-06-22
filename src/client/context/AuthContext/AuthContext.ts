import { createContext } from 'react';

interface GoogleProfile {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

interface GithubProfile {}

interface FacebookProfile {
  id: string;
  name: string;
}

interface DiscordProfile {
  avatar: string;
  discriminator: string;
  email: string;
  flags: number;
  id: string;
  locale: string;
  mfa_enabled: boolean;
  public_flags: number;
  username: string;
  verified: boolean;
}

export type User =
  | GithubProfile
  | GoogleProfile
  | FacebookProfile
  | DiscordProfile;

export type Provider = 'github' | 'google' | 'facebook' | 'discord' | 'local';

export type ExternalProvider = Exclude<Provider, 'local'>;

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
