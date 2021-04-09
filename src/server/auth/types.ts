/* istanbul ignore file */
import type { User } from '../../client/context/AuthContext/types';
import type { SESSION_COOKIE_NAME } from '../../constants';

export type AuthenticatedRequest = {
  [SESSION_COOKIE_NAME]: User;
};

export type OAuth2GetParams<Params = Record<string, unknown>> = Params & {
  redirect_uri: string;
  code: string;
  client_id: string;
  client_secret: string;
};

export type OAuth2Response = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};
