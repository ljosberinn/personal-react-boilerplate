/* istanbul ignore file */
import nextConnect from 'next-connect';

import { providerHandler } from '../../../../server/auth/routes/provider';

export default nextConnect().use(providerHandler);
