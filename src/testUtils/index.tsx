import { ThemeProvider, ColorModeProvider, CSSReset } from '@chakra-ui/core';
import { render as rtlRender } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory, History } from 'history';
import React, { Suspense, ReactNode } from 'react';
import { I18nextProvider, withTranslation } from 'react-i18next';
import { Router } from 'react-router-dom';

import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../constants/env';
import { NavigationProvider, Auth0Provider } from '../context';
import i18n from './i18n';

function Wrapper({ children }: { children: ReactNode }): JSX.Element {
  return (
    <ThemeProvider>
      <ColorModeProvider>
        <CSSReset />
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </ColorModeProvider>
    </ThemeProvider>
  );
}

type NavigationTestProps = {
  /**
   * initial route to to render history with
   */
  route?: string;
  /**
   * createMemoryHistory to be manipulated in the test
   */
  history?: MemoryHistory<History.PoorMansUnknown>;
  /**
   * whether to include the i18n.t prop - defaults to true
   */
  includeTranslation?: boolean;
};

function render(
  component: JSX.Element,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    includeTranslation = true,
  }: NavigationTestProps = {}
) {
  // ignore i18n and tReady props generally
  const Component = withTranslation()(({ i18n, t, tReady }) => ({
    ...component,
    props: { ...component.props, t: includeTranslation ? t : undefined },
  }));

  return {
    ...rtlRender(
      <Router history={history}>
        <NavigationProvider>
          {/* <Auth0Provider
            onRedirectCallback={() => {}}
            domain={AUTH0_DOMAIN}
            client_id={AUTH0_CLIENT_ID}
          > */}
          <Suspense fallback={null}>
            <Component />
          </Suspense>
          {/* </Auth0Provider> */}
        </NavigationProvider>
      </Router>,
      {
        //@ts-ignore
        wrapper: Wrapper,
      }
    ),
    history,
  };
}

export * from '@testing-library/react';
export { render };
