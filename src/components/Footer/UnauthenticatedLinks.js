import React from 'react';

import { REGISTER, LOGIN, RESET_PASSWORD } from '../../routes/config';
import InternalLink from './InternalLink';

/**
 *
 * @param {{
 * t: import('i18next').TFunction
 * }}
 */
export default function UnauthenticatedLinks({ t }) {
  return (
    <>
      <li>
        <InternalLink route={REGISTER} t={t} />
      </li>
      <li>
        <InternalLink route={LOGIN} t={t} />
      </li>
      <li>
        <InternalLink route={RESET_PASSWORD} t={t} />
      </li>
    </>
  );
}
