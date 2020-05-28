import { NextApiRequest, NextApiResponse } from 'next';

import { removeTokenCookie } from '../../../../src/server/auth/cookie';
import { OK } from '../../../../src/utils/statusCodes';

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  removeTokenCookie(res);

  res.status(OK).end();
}
