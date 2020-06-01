import { Profile } from 'passport';
import { Profile as DiscordProfile } from 'passport-discord';
import { Profile as BaseGithubProfile } from 'passport-github2';
import { createContext } from 'react';

export interface GithubProfile extends BaseGithubProfile {
  provider: 'github';
}

export interface GoogleProfile extends Profile {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  language: string;
  picture: string;
  sub: string;
  verified: boolean;
  provider: 'google';
}

export interface FacebookProfile {
  username: never;
  name: {};
  emails: never;
  photos: never;
  provider: 'facebook';
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
