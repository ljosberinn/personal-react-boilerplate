import { ChakraProvider } from '@chakra-ui/react';
import type { RenderResult, RenderOptions } from '@testing-library/react';
import { render as rtlRender } from '@testing-library/react';
import type { RenderHookResult } from '@testing-library/react-hooks';
import { renderHook as rtlRenderHook } from '@testing-library/react-hooks';
import type { RunOptions } from 'axe-core';
import type { ConfigData } from 'html-validate';
import { axe } from 'jest-axe';
import type { NextRouter } from 'next/router';
import { cloneElement, isValidElement } from 'react';

import { AuthContextProvider } from '../src/client/context/AuthContext';
import type { AuthContextDefinition } from '../src/client/context/AuthContext/types';
import { I18NContextProvider } from '../src/client/context/I18NContext';
import { useTranslation } from '../src/client/hooks/useTranslation';
import type { WithChildren } from '../src/client/karma/types';
import type { Namespace } from '../src/constants';
import { FALLBACK_LANGUAGE } from '../src/constants';
import { i18nCache } from './i18n';
import { MockRouterContext } from './router';
import 'html-validate/jest';
// may not be in setupTests.js because lambda-Tests rely on node-fetch which
// collides with whatwg-fetch
import 'whatwg-fetch';

export * from '@testing-library/react';
export { act as hookAct } from '@testing-library/react-hooks';
export { default as userEvent } from '@testing-library/user-event';

type UI = Parameters<typeof rtlRender>[0];
type I18NPropAlias = {
  t?: string;
};

export type TestOptions = Omit<RenderOptions, 'wrapper'> & {
  /**
   * allows using `t={jest.fn()} ` in tests for components
   * that receive `t` via props
   *
   * @example
   * ```jsx
   * // using `t` prop as is
   * render(<MyComponent t={jest.fn()} />, {
   *  i18n: {
   *    namespace: 'my-namespace'
   *  }
   * });
   *
   * // using aliases in case i18n would overwrite existing props
   * import { TFunction } from 'react-i18next';
   *
   * interface ComponentProps {
   *   translate: TFunction;
   * }
   *
   * render(<Component translate={jest.fn()} />, {
   *  i18n: {
   *    namespace: 'namespace',
   *    alias: {
   *      t: 'translate',
   *    }
   *  }
   * });
   * ```
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
   * ```
   */
  wrapper?: typeof ChildrenPassthrough;
  /**
   * optional session to initialize AuthContextProvider with
   */
  session?: AuthContextDefinition['user'];
  /**
   * optional router partial
   */
  router?: Partial<NextRouter>;
  /**
   * if `true`, wraps given ui only in `RouterContext` from next and
   * the optionally given `wrapper`
   *
   * @default false
   */
  omitKarmaProvider?: boolean;
};

// UI-less passthrough fallback to prevent using conditional logic in render
function ChildrenPassthrough({ children }: WithChildren) {
  return isValidElement(children) ? children : null;
}

export type I18nTestMiddlewareProps = WithChildren<{
  namespace: Namespace;
  alias?: I18NPropAlias;
}>;

function I18nTestMiddleware({
  children,
  namespace,
  alias = {},
}: I18nTestMiddlewareProps) {
  const { t } = useTranslation(namespace);

  const props = {
    [alias.t ?? 't']: t,
  };

  return isValidElement(children) ? cloneElement(children, props) : null;
}

type KarmaTestSetupProps = WithChildren &
  Pick<
    TestOptions,
    'i18n' | 'router' | 'omitKarmaProvider' | 'wrapper' | 'session'
  >;

function KarmaTestSetup({
  children,
  router,
  omitKarmaProvider,
  session = null,
  i18n,
  wrapper: Wrapper = ChildrenPassthrough,
}: KarmaTestSetupProps) {
  return (
    <MockRouterContext router={router}>
      {omitKarmaProvider ? (
        <Wrapper>{children}</Wrapper>
      ) : (
        <I18NContextProvider locale={FALLBACK_LANGUAGE} resources={i18nCache}>
          <AuthContextProvider mode="ssr" session={session}>
            <ChakraProvider portalZIndex={40}>
              <Wrapper>
                {i18n ? (
                  <I18nTestMiddleware {...i18n}>{children}</I18nTestMiddleware>
                ) : (
                  children
                )}
              </Wrapper>
            </ChakraProvider>
          </AuthContextProvider>
        </I18NContextProvider>
      )}
    </MockRouterContext>
  );
}

/**
 * Custom render for @testing-library/react
 *
 * @see https://testing-library.com/docs/react-testing-library/setup#custom-render
 * @param component the component under test
 * @param options test options
 */
export function render(
  ui: UI,
  {
    i18n,
    wrapper = ChildrenPassthrough,
    session = null,
    router,
    omitKarmaProvider,
    ...rest
  }: TestOptions = {}
): RenderResult {
  const setupProps = {
    i18n,
    omitKarmaProvider,
    router,
    session,
    wrapper,
  };

  return rtlRender(ui, {
    ...rest,
    wrapper: ({ children }) => (
      <KarmaTestSetup {...setupProps}>{children}</KarmaTestSetup>
    ),
  });
}

type HookTestOptions = Pick<
  TestOptions,
  'i18n' | 'wrapper' | 'omitKarmaProvider' | 'router' | 'session'
>;

export function renderHook<Props extends { children: JSX.Element }, Result>(
  callback: (props: Props) => Result,
  {
    i18n,
    wrapper,
    session,
    router,
    omitKarmaProvider,
    ...rest
  }: HookTestOptions = {}
): RenderHookResult<Props, Result> {
  const setupProps = {
    i18n,
    omitKarmaProvider,
    router,
    session,
    wrapper,
  };

  return rtlRenderHook<Props, Result>(callback, {
    ...rest,
    wrapper: ({ children }) => (
      <KarmaTestSetup {...setupProps}>{children}</KarmaTestSetup>
    ),
  });
}

type TestA11YOptions = TestOptions & { axeOptions?: RunOptions };
/**
 * Validates against common a11y mistakes.
 *
 * Wrapper for jest-axe
 *
 * @example
 * ```jsx
 * it('passes a11y test', async () => {
 *  await testA11Y(<MyComponent />, options);
 * });
 *
 * // sometimes we need to perform interactions first to render conditional UI
 * it('passes a11y test when open', async () => {
 *  const { container } = render(<MyComponent />, options);
 *
 *  userEvent.click(screen.getByRole('button'));
 *
 *  await testA11Y(container, options);
 * });
 * ```
 *
 * @see https://github.com/nickcolley/jest-axe#testing-react-with-react-testing-library
 */
export const testA11Y = async (
  ui: UI | Element,
  { axeOptions, ...options }: TestA11YOptions = {}
): Promise<void> => {
  const element = isValidElement(ui) ? render(ui, options).container : ui;
  // @ts-expect-error version, and thus type incompat
  const results = await axe(element, axeOptions);

  expect(results).toHaveNoViolations();
};

type HTMLValidationRules =
  | 'wcag/h30'
  | 'wcag/h32'
  | 'wcga/h36'
  | 'wcag/h37'
  | 'wcag/h67'
  | 'wcag/h71'
  | 'allowed-links'
  | 'attr-case'
  | 'attr-quotes'
  | 'attribute-allowed-values'
  | 'attribute-boolean-style'
  | 'attribute-empty-style'
  | 'class-pattern'
  | 'close-attr'
  | 'close-order'
  | 'deprecated'
  | 'deprecated-rule'
  | 'doctype-html'
  | 'element-case'
  | 'element-name'
  | 'element-permitted-content'
  | 'element-permitted-occurrences'
  | 'element-permitted-order'
  | 'element-required-attributes'
  | 'element-required-content'
  | 'empty-heading'
  | 'empty-title'
  | 'heading-level'
  | 'id-pattern'
  | 'input-missing-label'
  | 'long-title'
  | 'meta-refresh'
  | 'missing-doctype'
  | 'no-autoplay'
  | 'no-conditional-comment'
  | 'no-deprecated-attr'
  | 'no-dup-attr'
  | 'no-dup-class'
  | 'no-dup-id'
  | 'no-implicit-close'
  | 'no-inline-style'
  | 'no-missing-references'
  | 'no-raw-characters'
  | 'no-redundant-role'
  | 'no-self-closing'
  | 'no-style-tag'
  | 'no-trailing-whitespace'
  | 'no-unknown-element'
  | 'prefer-button'
  | 'prefer-native-element'
  | 'prefer-tbody'
  | 'prefer-sri'
  | 'script-element'
  | 'script-type'
  | 'svg-focusable'
  | 'unrecognized-char-ref'
  | 'void'
  | 'void-content'
  | 'void-style'
  | 'no-multiple-main';

// copied from node_modules/html-validate/build/config/config.data.d.ts
type RuleSeverity = 'off' | 'warn' | 'error' | number;

type Rules = {
  rules: {
    [key in HTMLValidationRules]?: RuleSeverity | [RuleSeverity];
  };
};

type HTMLValidateOptions = Omit<ConfigData, 'rules'> & Rules;

const defaultConfig: HTMLValidateOptions = {
  rules: {
    // some chakra atributes render as such
    'attribute-boolean-style': 'off',
    // emotion renders lots of inline styles
    'no-inline-style': 'off',
  },
};

type ValidateHtmlOptions = TestOptions & { htmlValidate?: HTMLValidateOptions };

/**
 * Tests against invalid HTML.
 *
 * Wrapper for html-validate/jest
 *
 * @example
 * ```jsx
 * it('contains valid html', () => {
 *   validateHtml(<MyComponent />, options);
 * })
 *
 * // sometimes we need to perform interactions first to render conditional UI
 * it('contains valid html when opened', () => {
 *  const { container } = render(<MyComponent />, options);
 *
 *  userEvent.click(screen.getByRole('button'));
 *
 *  validateHtml(container, options);
 * })
 * ```
 *
 * @see https://html-validate.org/frameworks/jest.html
 */
export const validateHtml = (
  ui: UI | Element,
  { htmlValidate, ...options }: ValidateHtmlOptions = {}
): void => {
  const merged: ConfigData = {
    ...htmlValidate,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    rules: {
      ...htmlValidate?.rules,
      ...defaultConfig.rules,
    } as Record<string, RuleSeverity>,
  };

  const element = isValidElement(ui) ? render(ui, options).container : ui;

  expect(element).toHTMLValidate(merged);
};
