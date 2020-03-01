import React from 'react';

import { SentryErrorBoundary } from '../components';

/**
 *
 * @param {React.ComponentType} Component
 */
export default function withSentry(Component) {
  const displayName = `withSentry(${Component.displayName ||
    Component.Name ||
    'Unknown'})`;

  const C = props => (
    <SentryErrorBoundary>
      <Component {...props} />
    </SentryErrorBoundary>
  );

  C.displayName = displayName;
  C.WrappedComponent = Component;

  return C;
}
