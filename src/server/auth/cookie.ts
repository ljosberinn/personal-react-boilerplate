import { seal, unseal, defaults } from '@hapi/iron';
import { serialize, parse } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

import { IS_PROD } from '../../constants';
import { MAX_AGE, SESSION_COOKIE_NAME, TOKEN_SECRET } from './authConstants';

export const encryptSession = (session: unknown) =>
  seal(session, TOKEN_SECRET, defaults);

export const getSession = async (req: NextApiRequest) => {
  const token = getTokenCookie(req);

  return token ? unseal(token, TOKEN_SECRET, defaults) : null;
};

export const setTokenCookie = (res: NextApiResponse, token: string) => {
  const cookie = serialize(SESSION_COOKIE_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE),
    httpOnly: true,
    secure: IS_PROD,
    path: '/',
    sameSite: 'strict',
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

export const parseCookies = (req: NextApiRequest) => {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) {
    return req.cookies;
  }

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie;
  return parse(cookie || '');
};

export const getTokenCookie = (req: NextApiRequest) =>
  parseCookies(req)[SESSION_COOKIE_NAME];
