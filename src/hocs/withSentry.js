import React from 'react';

import SentryErrorBoundary from '../components/SentryErrorBoundary';

/**
 *
 * @param {React.ComponentType} Component
 */
export default function withSentry(Component) {
  const displayName = `withSentry(${Component.displayName ||
    Component.Name ||
    'Unknown'})`;

  function C(props) {
    return (
      <SentryErrorBoundary>
        <Component {...props} />
      </SentryErrorBoundary>
    );
  }

  C.displayName = displayName;
  C.WrappedComponent = Component;

  return C;
}
