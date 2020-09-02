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

interface GithubProfile {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: 'User';
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: null | string;
  hireable: null | string;
  bio: string;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: Date;
  updated_at: Date;
  private_gists: number;
  total_private_repos: number;
  owned_private_repos: number;
  disk_usage: number;
  collaborators: number;
  two_factor_authentication: boolean;
  plan: {
    collaborators: number;
    name: 'free';
    private_repos: number;
  };
}

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
  register: (options: LocalLoginOptions) => Promise<User | number>;
  login: (options: LoginOptions) => Promise<User | number | null>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextDefinition | null>(null);
