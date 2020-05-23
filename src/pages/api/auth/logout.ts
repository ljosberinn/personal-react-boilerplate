import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

import { SESSION_COOKIE_NAME } from '../../../server/auth/constants';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.cookies[SESSION_COOKIE_NAME]) {
    res.setHeader(
      'Set-Cookie',

      cookie.serialize(SESSION_COOKIE_NAME, '', {
        path: '/',
        expires: new Date(0),
      })
    );
  }

  res.end();
}
