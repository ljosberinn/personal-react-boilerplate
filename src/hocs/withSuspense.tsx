import React, { Suspense, ComponentType } from 'react';

export default function withSuspense(
  Component: ComponentType,
  fallback: ComponentType | null = null
) {
  const displayName = `withSuspense(${
    Component.displayName || Component.name || 'Unknown'
  })`;

  function C(props: any) {
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
