import { render as rtlRender } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React, { Suspense } from 'react';
import { I18nextProvider, withTranslation } from 'react-i18next';
import { IdentityContextProvider } from 'react-netlify-identity';
import { Router } from 'react-router-dom';

import { SITE_URL } from '../constants/env';
import { ThemeProvider, ServiceWorkerProvider } from '../context';
import i18n from './testi18n';

export default function render(
  component,
  {
    route = '/',
    history = createMemoryHistory({
      initialEntries: [route],
    }),
  } = {},
) {
  const Component = withTranslation()(props => ({
    ...component,
    props: { ...component.props, ...props },
  }));

  function Wrapper({ children }) {
    return (
      <ThemeProvider>
        <ServiceWorkerProvider>
          <IdentityContextProvider url={SITE_URL}>
            <I18nextProvider i18n={i18n}>
              <Router history={history}>
                <Suspense fallback={null}>{children}</Suspense>
              </Router>
            </I18nextProvider>
          </IdentityContextProvider>
        </ServiceWorkerProvider>
      </ThemeProvider>
    );
  }

  return {
    ...rtlRender(<Component />, {
      wrapper: Wrapper,
    }),
    history,
  };
}
