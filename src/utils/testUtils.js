import React, { Suspense } from 'react';
import { IdentityContextProvider } from 'react-netlify-identity';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import i18n from './testi18n';
import { Loader } from '../components';
import { I18nextProvider, withTranslation } from 'react-i18next';
import { render as rtlRender } from '@testing-library/react';
import { ThemeProvider } from '../context';

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
        <IdentityContextProvider url={process.env.REACT_APP_SITE_URL}>
          <ThemeProvider>
            <I18nextProvider i18n={i18n}>
              <Router history={history}>
                <Suspense fallback={<Loader isFullPage />}>{children}</Suspense>
              </Router>
            </I18nextProvider>
          </ThemeProvider>
        </IdentityContextProvider>
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
