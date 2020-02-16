import React from 'react';

import SentryErrorBoundary from '../components/SentryErrorBoundary';

/**
 *
 * @param {React.ComponentType} Component
 */
export default function withSentry(Component) {
  const displayName = `withSentry(${Component.displayName ||
    Component.Name ||
    'UnknownComponent'})`;

  const C = props => (
    <SentryErrorBoundary>
      <Component {...props} />
    </SentryErrorBoundary>
  );

  C.displayName = displayName;
  C.WrappedComponent = Component;

  return C;
}
