/* istanbul ignore file */
import nextConnect from 'next-connect';

import { providerHandler } from '../../../../server/auth/routes/provider';

// eslint-disable-next-line import/no-default-export
export default nextConnect().use(providerHandler);
