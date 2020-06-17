import { RequestHandler } from 'next-connect';

import { ExternalProvider } from '../../../client/context/AuthContext/AuthContext';
import { ENABLED_PROVIDER } from '../../../constants';
import { INTERNAL_SERVER_ERROR } from '../../../utils/statusCodes';
import { promisifyAuthentication } from '../utils';

export const externalProviderHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const [provider] = req.query.authRouter as ExternalProvider[];

  if (
    ENABLED_PROVIDER.includes(provider) &&
    Object.keys(req.query).length === 1
  ) {
    try {
      await promisifyAuthentication(provider, req, res);
    } catch {
      return res.status(INTERNAL_SERVER_ERROR).end();
    }
  }

  next();
};

export default externalProviderHandler;
