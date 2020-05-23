import nextCookies from 'next-cookies';

import { SESSION_COOKIE_NAME } from '../server/auth/constants';
import { User } from './context/AuthContext/AuthContext';

export const getSessionData = (
  cookies: ReturnType<typeof nextCookies>
): User | null => {
  const session = cookies[SESSION_COOKIE_NAME];

  if (session) {
    return JSON.parse(Buffer.from(session, 'base64').toString());
  }

  return null;
};
