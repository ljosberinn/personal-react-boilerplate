import { NextApiResponse, NextApiRequest } from 'next';

import { Provider } from '../../../../client/context/AuthContext/AuthContext';
import { ENABLED_PROVIDER } from '../../../../constants';
import withPassport, { passport } from '../../../../server/auth/withPassport';
import { NOT_FOUND } from '../../../../utils/statusCodes';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const provider = req.query.provider as Provider;

  if (!provider || !ENABLED_PROVIDER.includes(provider)) {
    res.status(NOT_FOUND).end();
  }

  const authenticate = passport.authenticate(provider, {
    failureRedirect: '/',
    successRedirect: '/',
  });

  authenticate(req, res, () => res.end());
};

export default withPassport(handler);
