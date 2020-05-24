import { NextApiRequest, NextApiResponse } from 'next';

import { removeTokenCookie } from '../../../server/auth/cookie';
import { FOUND_MOVED_TEMPORARILY } from '../../../utils/statusCodes';

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  removeTokenCookie(res);

  res.writeHead(FOUND_MOVED_TEMPORARILY, { Location: '/' }).end();
}
