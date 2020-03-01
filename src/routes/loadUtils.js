import React from 'react';
import Loadable from 'react-loadable';

import { Loader } from '../components';

/**
 *
 * @param {() => Promise<JSX.Element>} loader
 */
const LoadableComponent = loader =>
  Loadable({
    loader,
    loading: Loading,
    delay: 750,
  });

/**
 *
 * @param {Error} error
 * @param {boolean} pastDelay
 */
const Loading = ({ error, pastDelay }) => {
  if (error) {
    throw error;
  }

  if (pastDelay) {
    return <Loader isFullPage />;
  }

  return null;
};

export default LoadableComponent;
