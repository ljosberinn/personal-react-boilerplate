import React from 'react';

import { SETTINGS } from '../../routes/config';
import InternalLink from './InternalLink';

/**
 *
 * @param {{
 * t: import('i18next').TFunction
 * }}
 */
export default function AuthenticatedLinks({ t }) {
  return (
    <li>
      <InternalLink route={SETTINGS} t={t} />
    </li>
  );
}
