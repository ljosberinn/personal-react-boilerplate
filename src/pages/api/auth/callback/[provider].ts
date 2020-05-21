import { NextApiResponse, NextApiRequest } from 'next';

import withPassport, { passport } from '../../../../server/auth/withPassport';
import { NOT_FOUND } from '../../../../utils/statusCodes';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { provider } = req.query;

  if (!provider) {
    return { statusCode: NOT_FOUND };
  }

  const handler = passport.authenticate(provider, {
    failureRedirect: '/auth',
    successRedirect: '/',
  });

  handler(req, res, (...args: any) => {
    console.log('auth callback', args);
    return true;
  });
};

export default withPassport(handler);
