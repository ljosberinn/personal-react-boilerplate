import { seal, unseal, defaults } from '@hapi/iron';
import { serialize, parse, CookieSerializeOptions } from 'cookie';
import { IncomingMessage } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';

import { User } from '../../client/context/AuthContext/AuthContext';
import {
  IS_PROD,
  SESSION_COOKIE_SECRET,
  SESSION_LIFETIME,
  SESSION_COOKIE_NAME,
} from '../../constants';

type SSRCompatibleRequest = NextApiRequest | IncomingMessage;

export const encryptSession = (session: unknown) =>
  seal(session, SESSION_COOKIE_SECRET, defaults);

/**
 * extracts & decrypts the session cookie, if existing
 */
export const getSession = (
  req: SSRCompatibleRequest | undefined
): null | Promise<User> => {
  if (!req) {
    return null;
  }

  const token = getSessionCookie(req);

  return token ? unseal(token, SESSION_COOKIE_SECRET, defaults) : null;
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
) => {
  const header = serialize(name, value, options);

  res.setHeader('Set-Cookie', header);
};

export const setSessionCookie = (token: string, res: NextApiResponse) => {
  const options: CookieSerializeOptions = {
    expires: new Date(Date.now() + SESSION_LIFETIME),
    httpOnly: true,
    maxAge: SESSION_LIFETIME,
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

export const removeCookie = (name: string, res: NextApiResponse) => {
  const value = serialize(name, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', value);
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

export const getSessionCookie = (req: SSRCompatibleRequest) =>
  parseCookies(req)[SESSION_COOKIE_NAME];
