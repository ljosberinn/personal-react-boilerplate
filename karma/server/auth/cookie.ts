import type { CookieSerializeOptions } from 'cookie';
import { serialize, parse } from 'cookie';
import type { IncomingMessage } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';

import type { User } from '../../../karma/client/context/AuthContext/AuthContext';
import {
  SESSION_LIFETIME,
  IS_PROD,
  SESSION_COOKIE_NAME,
} from '../../../src/constants';

type SSRCompatibleRequest = NextApiRequest | IncomingMessage;

export const encryptSession = (session: object): string =>
  JSON.stringify(session);

/**
 * extracts & decrypts the session cookie, if existing
 */
export const getSession = (req: SSRCompatibleRequest): User | null => {
  const token = getSessionCookie(req);

  if (token) {
    try {
      return JSON.parse(token);
    } catch {
      return null;
    }
  }

  return null;
};

interface NewCookieOptions {
  name: string;
  value: string;
  options?: CookieSerializeOptions;
}

/**
 * Sets new cookies on the res object via `Set-Cookie`.
 */
export const setCookie = (
  { name, value, options }: NewCookieOptions,
  res: NextApiResponse
): void => {
  const header = serialize(name, value, options);

  res.setHeader('Set-Cookie', header);
};

export const setSessionCookie = (token: string, res: NextApiResponse): void => {
  const options: CookieSerializeOptions = {
    expires: new Date(Date.now() + SESSION_LIFETIME),
    httpOnly: true,
    maxAge: SESSION_LIFETIME / 1000,
    path: '/',
    // required for OAuth2 to work instantly in FF
    sameSite: 'lax',
    secure: IS_PROD,
  };

  setCookie(
    {
      name: SESSION_COOKIE_NAME,
      options,
      value: token,
    },
    res
  );
};

export const removeCookie = (name: string, res: NextApiResponse): void => {
  const value = serialize(name, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', value);
};

export const parseCookies = (
  req: SSRCompatibleRequest
): Record<string, string> => {
  // For API Routes we don't need to parse the cookies.
  if ('cookies' in req) {
    return req.cookies;
  }

  // For pages we do need to parse the cookies.
  return parse(req.headers.cookie ?? '');
};

export const getSessionCookie = (req: SSRCompatibleRequest): string =>
  parseCookies(req)[SESSION_COOKIE_NAME];
