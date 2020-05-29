import { Profile } from 'passport';

import { User } from '../../client/context/AuthContext/AuthContext';
import { SESSION_COOKIE_NAME } from './authConstants';

export interface AuthenticatedRequest {
  [SESSION_COOKIE_NAME]: User;
}

export interface RawResponse extends Profile {
  _json: string;
  _raw: object;
}
