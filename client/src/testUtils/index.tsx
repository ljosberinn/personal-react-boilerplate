import { ThemeProvider, ColorModeProvider } from '@chakra-ui/core';
import { render as rtlRender } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory, History } from 'history';
import React, { Suspense, ReactNode } from 'react';
import { I18nextProvider, I18nContext } from 'react-i18next';
import { Router } from 'react-router-dom';

import { Auth0ContextDefinition } from '../context/Auth0/context';
import { NavigationProvider } from '../context/Navigation';
import { createAuthWrapper } from './authWrapper';
import i18n from './i18n';

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
  /**
   * an optional additional wrapper, e.g. mocked context providers
   */
  wrapper?: typeof ChildrenPassthrough;
  /**
   * props to mock Auth0Provider with
   */
  authProviderProps?: Partial<Auth0ContextDefinition>;
};

function ChildrenPassthrough({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function render(
  component: JSX.Element,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    includeTranslation = true,
    authProviderProps = {},
    wrapper: AdditionalWrapper = ChildrenPassthrough,
  }: NavigationTestProps = {}
) {
  const AuthProvider = createAuthWrapper(authProviderProps);

  return {
    ...rtlRender(
      <ThemeProvider>
        <ColorModeProvider>
          <I18nextProvider i18n={i18n}>
            <Router history={history}>
              <AuthProvider>
                <NavigationProvider>
                  <Suspense fallback={null}>
                    <AdditionalWrapper>
                      <I18nContext.Consumer>
                        {({ t }) => {
                          // this allows usage of render(<Component some="prop" />) in tests
                          // translation won't break because the actual tFunction will be injected if necessary
                          return {
                            ...component,
                            props: {
                              ...component.props,
                              t: includeTranslation ? t : undefined,
                            },
                          };
                        }}
                      </I18nContext.Consumer>
                    </AdditionalWrapper>
                  </Suspense>
                </NavigationProvider>
              </AuthProvider>
            </Router>
          </I18nextProvider>
        </ColorModeProvider>
      </ThemeProvider>
    ),
    history,
  };
}

export * from '@testing-library/react';
export { render };
