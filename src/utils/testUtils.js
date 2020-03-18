import MutationObserver from '@sheerun/mutationobserver-shim';
import { render as rtlRender } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React, { Suspense } from 'react';
import { I18nextProvider, withTranslation } from 'react-i18next';
import { IdentityContextProvider } from 'react-netlify-identity';
import { Router } from 'react-router-dom';

import { IdentityContextProvider as mockIdentityContextProvider } from '../../__mocks__/react-netlify-identity';
import { SITE_URL } from '../constants/env';
import { ThemeProvider, NavigationProvider } from '../context';
import i18n from './testi18n';

function customRender(
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
        <Router history={history}>
          <IdentityContextProvider url={SITE_URL}>
            <I18nextProvider i18n={i18n}>
              <NavigationProvider>
                <Suspense fallback={null}>{children}</Suspense>
              </NavigationProvider>
            </I18nextProvider>
          </IdentityContextProvider>
        </Router>
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

export * from '@testing-library/react';
export { customRender as render };

jest.mock('react-netlify-identity');

beforeEach(() => {
  IdentityContextProvider.mockImplementation(mockIdentityContextProvider);

  window.MutationObserver = MutationObserver;

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  class IntersectionObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserver,
  });

  Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserver,
  });
});
