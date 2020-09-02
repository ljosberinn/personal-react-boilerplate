import type { User } from '../../../karma/client/context/AuthContext/AuthContext';
import { SESSION_COOKIE_NAME } from '../../../src/constants';

export interface AuthenticatedRequest {
  [SESSION_COOKIE_NAME]: User;
}
