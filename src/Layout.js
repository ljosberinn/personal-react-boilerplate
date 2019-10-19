import React from 'react';
import { Column } from 'rbx';
import {  Loader, Footer, Navbar } from './components';
import { useTheme } from './hooks/';

export default function Layout({ children }) {
  const themeProps = useTheme();

  return (
    <>
      <Column.Group centered>
        <Column
          widescreen={{ size: 9 }}
          desktop={{ size: 9 }}
          tablet={{ size: 12 }}
          mobile={{ size: 12 }}
        >
          <Navbar {...themeProps} />
        </Column>
      </Column.Group>
      <main style={{ flex: 1, display: 'flex' }}>
        {themeProps.isLoading && <Loader />}
        {children}
      </main>
      <Footer />
    </>
  );
}
