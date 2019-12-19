import React, { Suspense } from 'react';
import { Column } from 'rbx';
import { Footer, Navbar } from './components';

/**
 *
 * @returns {React.FC<{
 * children: React.ReactChildren
 * }>} Layout
 */
export default function Layout({ children }) {
  return (
    <>
      <Column.Group centered as="header">
        <Column>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
        </Column>
      </Column.Group>
      <main>{children}</main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
