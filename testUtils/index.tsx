import { ThemeProvider, ColorModeProvider } from '@chakra-ui/core';
import { render as rtlRender } from '@testing-library/react';
import * as React from 'react';
import { I18nextProvider, I18nContext } from 'react-i18next';

import i18n from './i18n';

type TestOptions = {
  /**
   * whether to include the i18n.t prop
   * @default true
   */
  includeTranslation?: boolean;
  wrapper?: typeof ChildrenPassthrough;
};

function ChildrenPassthrough({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function render(
  component: JSX.Element,
  {
    includeTranslation = true,
    wrapper: AdditionalWrapper = ChildrenPassthrough,
  }: TestOptions = {}
) {
  return {
    ...rtlRender(
      <ThemeProvider>
        <ColorModeProvider>
          <I18nextProvider i18n={i18n}>
            <AdditionalWrapper>
              <I18nContext.Consumer>
                {({ t }) =>
                  // this allows usage of render(<Component some="prop" />) in tests
                  // translation won't break because the actual tFunction will be injected if necessary
                  React.cloneElement(component, {
                    t: includeTranslation ? t : undefined,
                  })
                }
              </I18nContext.Consumer>
            </AdditionalWrapper>
          </I18nextProvider>
        </ColorModeProvider>
      </ThemeProvider>
    ),
  };
}

export * from '@testing-library/react';
export { render };
