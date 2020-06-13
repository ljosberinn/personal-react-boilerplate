import { ThemeProvider, ColorModeProvider } from '@chakra-ui/core';
import { render as rtlRender } from '@testing-library/react';
import React, { cloneElement, ReactNode } from 'react';
import { I18nextProvider, I18nContext } from 'react-i18next';

import { AuthContextProvider } from '../src/client/context/AuthContext';
import { User } from '../src/client/context/AuthContext/AuthContext';
import i18n from './i18n';

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
  session?: User | null;
};

function ChildrenPassthrough({ children }: { children: ReactNode }) {
  return <>{children}</>;
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
      <ThemeProvider>
        <ColorModeProvider>
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
        </ColorModeProvider>
      </ThemeProvider>
    ),
  };
}

export * from '@testing-library/react';
export { render };
