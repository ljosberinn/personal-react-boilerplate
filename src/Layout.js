import { Column } from 'rbx';
import React, { Suspense } from 'react';

import styles from './Layout.module.scss';
import { Footer, Navbar, DrawerNav } from './components';
/**
 *
 * @param {{
 * children: JSX.Element;
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
      <Column.Group gapless as="main">
        <Suspense fallback={null}>
          <DrawerNav />
        </Suspense>

        <Suspense fallback={null}>
          <Column className={styles.shadow}>{children}</Column>
        </Suspense>
      </Column.Group>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
