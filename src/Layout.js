import { Column } from 'rbx';
import React, { Suspense } from 'react';

import { Footer, Navbar, DrawerNav } from './components';

/**
 *
 * @param {{
 * children: JSX.Element;
 * isLoggedIn: boolean;
 * }}
 */
export default function Layout({ children, isLoggedIn }) {
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
        <Suspense fallback={null}>
          {isLoggedIn && <DrawerNav />}
          {children}
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
