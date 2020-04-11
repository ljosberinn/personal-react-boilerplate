import React, { ComponentType } from 'react';

import { SentryErrorBoundary } from '../components/SentryErrorBoundary';

export default function withSentry(Component: ComponentType) {
  const displayName = `withSentry(${
    Component.displayName || Component.name || 'Unknown'
  })`;

  function C(props: any) {
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
