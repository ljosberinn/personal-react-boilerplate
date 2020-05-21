import { NextApiResponse, NextApiRequest } from 'next';

import withPassport, { passport } from '../../../server/auth/withPassport';
import { NOT_FOUND } from '../../../utils/statusCodes';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { provider } = req.query;

  if (!provider) {
    return { statusCode: NOT_FOUND };
  }

  const authenticator = passport.authenticate(provider);

  authenticator(req, res, (...args: any) => {
    console.log('passport authenticated', args);
  });
};

export default withPassport(handler);
