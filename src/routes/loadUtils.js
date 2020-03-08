import loadable from '@loadable/component';
import { timeout } from 'promise-timeout';
import React from 'react';

import { Loader } from '../components';

/**
 *
 * @param {Promise<React.ComponentType>} component
 * @param {number} delay
 */
export const withMaxDelay = (component, delay = 5000) =>
  timeout(component, delay);

export default component =>
  loadable(component, {
    fallback: <Loader isFullPage defer />,
  });
