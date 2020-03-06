import React from 'react';
import Loadable from 'react-loadable';

import { Loader } from '../components';

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

export default LoadableComponent;
