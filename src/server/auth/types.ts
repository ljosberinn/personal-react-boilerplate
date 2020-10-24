/* istanbul ignore file */
import type { User } from '../../client/context/AuthContext/types';
import { SESSION_COOKIE_NAME } from '../../constants';

export type AuthenticatedRequest = {
  [SESSION_COOKIE_NAME]: User;
};
