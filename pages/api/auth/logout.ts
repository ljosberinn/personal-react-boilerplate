import { NextApiRequest, NextApiResponse } from 'next';

import { removeTokenCookie } from '../../../src/server/auth/cookie';
import { FOUND_MOVED_TEMPORARILY } from '../../../src/utils/statusCodes';

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  removeTokenCookie(res);

  res.writeHead(FOUND_MOVED_TEMPORARILY, { Location: '/' }).end();
}
