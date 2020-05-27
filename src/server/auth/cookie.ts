import { seal, unseal, defaults } from '@hapi/iron';
import { serialize, parse } from 'cookie';
import { IncomingMessage } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';

import { User } from '../../client/context/AuthContext/AuthContext';
import { IS_PROD } from '../../constants';
import { MAX_AGE, SESSION_COOKIE_NAME } from './authConstants';
import { TOKEN_SECRET } from './env';

type SSRCompatibleRequest = NextApiRequest | IncomingMessage;

export const encryptSession = (session: unknown) =>
  seal(session, TOKEN_SECRET, defaults);

/**
 * extracts & decrypts the session cookie, if existing
 */
export const getSession = (
  req: SSRCompatibleRequest | undefined
): null | Promise<User> => {
  if (!req) {
    return null;
  }

  const token = getTokenCookie(req);

  return token ? unseal(token, TOKEN_SECRET, defaults) : null;
};

export const setTokenCookie = (res: NextApiResponse, token: string) => {
  const cookie = serialize(SESSION_COOKIE_NAME, token, {
    expires: new Date(Date.now() + MAX_AGE),
    httpOnly: true,
    maxAge: MAX_AGE,
    path: '/',
    // required for OAuth2 to work instantly in FF
    sameSite: 'lax',
    secure: IS_PROD,
  });

  res.setHeader('Set-Cookie', cookie);
};

export const removeTokenCookie = (res: NextApiResponse) => {
  const cookie = serialize(SESSION_COOKIE_NAME, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
};

export const parseCookies = (req: SSRCompatibleRequest) => {
  // For API Routes we don't need to parse the cookies.
  if ('cookies' in req) {
    return req.cookies;
  }

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie;
  return parse(cookie || '');
};

export const getTokenCookie = (req: SSRCompatibleRequest) =>
  parseCookies(req)[SESSION_COOKIE_NAME];
