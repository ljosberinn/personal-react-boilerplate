import { ThemeProvider, ColorModeProvider, CSSReset } from '@chakra-ui/core';
import { render as rtlRender } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory, History } from 'history';
import React, {
  Suspense,
  ReactNode,
  ComponentType,
  PropsWithChildren,
} from 'react';
import { I18nextProvider, withTranslation } from 'react-i18next';
import { Router } from 'react-router-dom';

import { Auth0ContextDefinition } from '../context/Auth0/context';
import { NavigationProvider } from '../context/Navigation';
import { createAuthWrapper } from './authWrapper';
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
  /**
   * an optional additional wrapper, e.g. mocked context providers such as Auth0
   */
  wrapper?: ComponentType;
  authProviderProps?: Partial<Auth0ContextDefinition>;
};

function render(
  component: JSX.Element,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    includeTranslation = true,
    authProviderProps = {},
    //@ts-ignore
    wrapper: AdditionalWrapper = ({ children }: PropsWithChildren<{}>) =>
      children,
  }: NavigationTestProps = {}
) {
  // ignore i18n and tReady props generally
  const Component = withTranslation()(({ i18n, t, tReady }) => ({
    ...component,
    props: { ...component.props, t: includeTranslation ? t : undefined },
  }));

  const AuthProvider = createAuthWrapper(authProviderProps);

  return {
    ...rtlRender(
      <Router history={history}>
        <AuthProvider>
          <NavigationProvider>
            <Suspense fallback={null}>
              <AdditionalWrapper>
                <Component />
              </AdditionalWrapper>
            </Suspense>
          </NavigationProvider>
        </AuthProvider>
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
