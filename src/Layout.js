import React, { Suspense } from 'react';
import { Column } from 'rbx';
import { Footer, Navbar } from './components';

/**
 *
 * @param {{
 * children: React.ReactChildren
 * }}
 */
export default function Layout({ children }) {
  return (
    <>
      <Column.Group as="header">
        <Column>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
        </Column>
      </Column.Group>
      <main>
        <Suspense fallback={null}>{children}</Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
