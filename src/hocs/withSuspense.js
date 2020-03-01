import React, { Suspense } from 'react';

/**
 *
 * @param {React.ComponentType} Component
 * @param {React.ComponentType | null} fallback
 */
export default function withSuspense(Component, fallback = null) {
  const displayName = `withSuspense(${Component.displayName ||
    Component.name ||
    'Unknown'})`;

  function C(props) {
    return (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    );
  }

  C.displayName = displayName;
  C.WrappedComponent = Component;

  return C;
}
