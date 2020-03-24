import { ThemeProvider, ColorModeProvider, CSSReset } from '@chakra-ui/core';
import { render as rtlRender } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory, History } from 'history';
import React, { Suspense, ReactNode } from 'react';
import { I18nextProvider, withTranslation } from 'react-i18next';
import { Router } from 'react-router-dom';

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
  route?: string;
  history?: MemoryHistory<History.PoorMansUnknown>;
};

function render(
  component: JSX.Element,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
  }: NavigationTestProps = {}
) {
  const Component = withTranslation()(props => ({
    ...component,
    props: { ...component.props, ...props },
  }));

  return {
    ...rtlRender(
      <Router history={history}>
        <Suspense fallback={null}>
          <Component />
        </Suspense>
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
