import * as React from 'react';

import { SETTINGS } from '../../../routes';
import Link from './Link';

export const defaultProps = {
  to: SETTINGS,
};

export default <Link {...defaultProps} />;
