import { NextApiRequest, NextApiResponse } from 'next';

import { SESSION_COOKIE_NAME } from '../../../../src/server/auth/authConstants';
import { removeCookie } from '../../../../src/server/auth/cookie';
import { OK } from '../../../../src/utils/statusCodes';

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  removeCookie(SESSION_COOKIE_NAME, res);

  res.status(OK).end();
}
