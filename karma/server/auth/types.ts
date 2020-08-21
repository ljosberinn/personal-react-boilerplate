import { User } from '../../../karma/client/context/AuthContext/AuthContext';
import { SESSION_COOKIE_NAME } from '../../constants';

export interface AuthenticatedRequest {
  [SESSION_COOKIE_NAME]: User;
}
