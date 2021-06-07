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
  /**
   * Given { provider: ENABLED_PROVIDER[number] }, will redirect.
   *
   * Given login data, will attempt to login.
   *
   * @returns
   * - nothing when redirecting
   * - the user when successfully authenticated
   * - the response status code when failing to authenticate
   * - INTERNAL_SERVER_ERROR when crashing
   */
  login: (options: LoginOptions) => Promise<User | number | null>;
  /**
   * Dispatches a request to the logout endpoint which deletes the session cookie.
   * Resets User object afterwards.
   *
   * Optionally accepts a destination to be redirected after logout
   */
  logout: (redirectDestination?: string) => Promise<void>;
  /**
   * simple boolean indicating whether the user is authenticated
   */
  isAuthenticated: boolean;
  /**
   * indicates reauthentication progress during `mode === 'ssg'` and `shouldAttemptReauthentication`
   * can be used similar to `isFallback` from `next/router` to show fallback UI
   */
  isReauthenticating: boolean;
};

export type OAuth2CallbackHandler<ProfileType> = (
  req: NextApiRequest,
  res: NextApiResponse,
  meta: { redirect_uri: string; code: string }
) => Promise<ProfileType | null>;

export type OAuth2RedirectHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  redirect_uri: string
) => void;
