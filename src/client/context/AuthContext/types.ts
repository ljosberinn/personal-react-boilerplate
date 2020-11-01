import type { NextApiRequest, NextApiResponse } from 'next';

import type { BattleNetProfile } from '../../../server/auth/strategies/battlenet';
import type { DiscordProfile } from '../../../server/auth/strategies/discord';
import type { FacebookProfile } from '../../../server/auth/strategies/facebook';
import type { GitHubProfile } from '../../../server/auth/strategies/github';
import type { GoogleProfile } from '../../../server/auth/strategies/google';

export type User =
  | GitHubProfile
  | GoogleProfile
  | FacebookProfile
  | DiscordProfile
  | BattleNetProfile;

export type Provider =
  | 'github'
  | 'google'
  | 'facebook'
  | 'discord'
  | 'local'
  | 'battlenet';

export type ExternalProvider = Exclude<Provider, 'local'>;

export type ExternalLoginOptions = {
  provider: Provider;
};

export type LocalLoginOptions = {
  username: string;
  password: string;
};

export type LoginOptions = ExternalLoginOptions | LocalLoginOptions;

export type AuthContextDefinition = {
  user: User | null;
  register: (options: LocalLoginOptions) => Promise<User | number>;
  login: (options: LoginOptions) => Promise<User | number | null>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

export type OAuthCallbackHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  meta: { origin: string; baseRedirectUrl: string; code: string }
) => Promise<User | null>;

export type OAuthRedirectHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  meta: { origin: string; baseRedirectUrl: string }
) => void;
