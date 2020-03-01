import { Column } from 'rbx';
import React, { memo } from 'react';

import styles from './Layout.module.scss';
import { Footer, Navbar, DrawerNav } from './components';
/**
 *
 * @param {{
 * children: JSX.Element;
 * }}
 */
export default memo(function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Column.Group gapless marginless as="main">
        <DrawerNav />
        <Column className={styles.shadow}>{children}</Column>
      </Column.Group>
      <Footer />
    </>
  );
});
