import { ChakraProvider } from '@chakra-ui/core';
import theme from '@chakra-ui/theme';
import { render as rtlRender } from '@testing-library/react';
import React, { cloneElement } from 'react';
import { I18nextProvider, I18nContext } from 'react-i18next';

import { AuthContextProvider } from '../src/client/context/AuthContext';
import { AuthContextDefinition } from '../src/client/context/AuthContext/AuthContext';
import { initI18Next } from '../src/client/i18n';
import { i18nCache } from '../src/server/i18n';

// may not be in seutpTests.js because lambda-Tests rely on node-fetch
// which collides with whatwg-fetch
import 'whatwg-fetch';

const i18n = initI18Next({
  i18nBundle: i18nCache['en'],
  i18nCache,
  language: 'en',
});

type TestOptions = {
  /**
   * whether to include the i18n.t prop
   * defaults to true
   */
  includeTranslation?: boolean;
  /**
   * optional additional wrapper, e.g. Context
   */
  wrapper?: typeof ChildrenPassthrough;
  /**
   * optional session to initialize AuthContextProvider with
   */
  session?: AuthContextDefinition['user'];
};

function ChildrenPassthrough({ children }: { children: JSX.Element }) {
  return children;
}

function render(
  component: JSX.Element,
  {
    includeTranslation = true,
    wrapper: AdditionalWrapper = ChildrenPassthrough,
    session = null,
  }: TestOptions = {}
) {
  return {
    ...rtlRender(
      <ChakraProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <AuthContextProvider session={session}>
            <AdditionalWrapper>
              <I18nContext.Consumer>
                {({ t }) =>
                  // this allows usage of render(<Component some="prop" />) in tests
                  // of components that receive `t` via props
                  cloneElement(component, {
                    t: includeTranslation ? t : undefined,
                  })
                }
              </I18nContext.Consumer>
            </AdditionalWrapper>
          </AuthContextProvider>
        </I18nextProvider>
      </ChakraProvider>
    ),
  };
}

export * from '@testing-library/react';
export { render };
