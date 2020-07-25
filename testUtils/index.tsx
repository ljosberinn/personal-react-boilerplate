import { ChakraProvider } from '@chakra-ui/core';
import theme from '@chakra-ui/theme';
import { render as rtlRender, RenderResult } from '@testing-library/react';
import React, { cloneElement, ReactElement } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';

import { AuthContextProvider } from '../src/client/context/AuthContext';
import { AuthContextDefinition } from '../src/client/context/AuthContext/AuthContext';
import { initI18Next } from '../src/client/i18n';
import { i18nCache } from '../src/server/i18n';

// may not be in setupTests.js because lambda-Tests rely on node-fetch which
// collides with whatwg-fetch
import 'whatwg-fetch';

// as singleton, else you will see lots of `act` warnings in tests which are
// technically unrelated to i18n
const i18nInstance = initI18Next({
  i18nBundle: i18nCache['en'],
  i18nCache,
  language: 'en',
});

type Children = { children: ReactElement };

type Namespace = Parameters<typeof useTranslation>[0];
type I18NPropAlias = {
  i18n?: string;
  ready?: string;
  t?: string;
};

export type TestOptions = {
  /**
   * allows using `t={jest.fn()} i18n={new MockI18n()} ready={true}` in tests for components
   * that receive `t`, `i18n` and|or `ready` via props
   *
   * @example
   * ```js
   * // using `t` prop as is
   * render(<MyComponent t={jest.fn()} />, {
   *  i18n: {
   *    namespace: 'my-namespace'
   *  }
   * });
   *
   * // using aliases in case i18n would overwrite existing props
   * import { TFunction, i18n } from 'react-i18next';
   *
   * interface ComponentProps {
   *   translate: TFunction;
   *   i18nInstance: i18n;
   * }
   *
   * render(<Component translate={jest.fn()} />, {
   *  i18n: {
   *    namespace: 'namespace',
   *    alias: {
   *      t: 'translate',
   *      i18n: 'i18nInstance'
   *    }
   *  }
   * });
   * ```
   *
   */
  i18n?: {
    namespace: Namespace;
    alias?: I18NPropAlias;
  };
  /**
   * optional additional wrapper, e.g. Context
   *
   * @example
   * ```ts
   * // single wrapper
   * render(<MyConponent />, {
   *  wrapper: MyContext
   * });
   *
   * // multiple wrapper
   * render(<MyConponent />, {
   *  wrapper: ({ children }) => (
   *    <ContextA>
   *      <ContextB>
   *        {children}
   *      <ContextB />
   *    <ContextA />
   *  )
   * });
   *
   * ```
   */
  wrapper?: typeof ChildrenPassthrough;
  /**
   * optional session to initialize AuthContextProvider with
   */
  session?: AuthContextDefinition['user'];
};

// UI-less passthrough fallback to prevent using conditional logic in render
// below
function ChildrenPassthrough({ children }: Children) {
  return children;
}

export interface I18nTestMiddlewareProps extends Children {
  namespace: Namespace;
  alias?: I18NPropAlias;
}

function I18nTestMiddleware({
  children,
  namespace,
  alias = {},
}: I18nTestMiddlewareProps) {
  const { t, i18n, ready } = useTranslation(namespace);

  const props = {
    [alias.i18n || 'i18n']: i18n,
    [alias.ready || 'ready']: ready,
    [alias.t || 't']: t,
  };

  return cloneElement(children, props);
}

/**
 * Custom render for @testing-library/react
 *
 * @see https://testing-library.com/docs/react-testing-library/setup#custom-render
 * @param component the component under test
 * @param options test options
 */
function render(
  component: ReactElement,
  {
    i18n,
    wrapper: Wrapper = ChildrenPassthrough,
    session = null,
  }: TestOptions = {}
): RenderResult {
  return rtlRender(
    <ChakraProvider theme={theme}>
      <I18nextProvider i18n={i18nInstance}>
        <AuthContextProvider session={session}>
          <Wrapper>
            {i18n ? (
              <I18nTestMiddleware {...i18n}>{component}</I18nTestMiddleware>
            ) : (
              component
            )}
          </Wrapper>
        </AuthContextProvider>
      </I18nextProvider>
    </ChakraProvider>
  );
}

export * from '@testing-library/react';
export { render };
