import React from 'react';

import './App.scss';
import { ThemeSwitch, ScrollToTop, Helmet } from './components';

export default function App() {
  return (
    <>
      <Helmet>
        <title>personal-react-boilerplate@next</title>
      </Helmet>
      <ScrollToTop />
      <header>
        <nav>
          <ThemeSwitch />
        </nav>
      </header>
      <main />
      <footer />
    </>
  );
}
