import { RouterContext } from 'next/dist/shared/lib/router-context';
import type { NextRouter } from 'next/router';
import * as nextRouter from 'next/router';

import type { WithChildren } from '../src/client/karma/types';

type MockRouterContextProps = WithChildren<{
  router?: Partial<NextRouter>;
}>;

export function MockRouterContext({
  children,
  router,
}: MockRouterContextProps): JSX.Element {
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const mockRouter: NextRouter = {
    asPath: '/',
    back: jest.fn(),
    basePath: '',
    beforePopState: jest.fn(),
    events: {
      emit: jest.fn(),
      off: jest.fn(),
      on: jest.fn(),
    },
    isFallback: false,
    pathname: '/',
    prefetch: jest.fn().mockReturnValue({
      catch: jest.fn(),
    }),
    push: jest.fn(),
    query: {},
    reload: jest.fn(),
    replace: jest.fn(),
    route: '/',
    isReady: true,
    isLocaleDomain: false,
    isPreview: false,
    ...router,
  };

  return (
    <RouterContext.Provider value={mockRouter}>
      {children}
    </RouterContext.Provider>
  );
}

type Options = {
  once?: boolean;
};

export const createRouterMock = (
  partial?: Partial<nextRouter.NextRouter>
): NextRouter => {
  let beforePopStateCallback: Function;

  return {
    asPath: '',
    back: jest.fn(),
    basePath: '',
    beforePopState: jest
      .fn()
      // eslint-disable-next-line promise/prefer-await-to-callbacks
      .mockImplementationOnce((callback: Function) => {
        beforePopStateCallback = callback;
      })
      .mockImplementationOnce(() => beforePopStateCallback()),
    events: {
      emit: jest.fn(),
      off: jest.fn(),
      on: jest.fn(),
    },
    isFallback: false,
    pathname: '',
    prefetch: jest.fn(),
    push: jest.fn(),
    query: {},
    reload: jest.fn(),
    replace: jest.fn(),
    route: '',
    isReady: true,
    isLocaleDomain: false,
    isPreview: false,
    ...partial,
  };
};

export const createUseRouterMock = ({
  once = true,
  ...partial
}: Partial<ReturnType<typeof nextRouter.useRouter>> &
  Options = {}): jest.SpyInstance<nextRouter.NextRouter, []> => {
  const mock = createRouterMock(partial);

  if (once) {
    return jest.spyOn(nextRouter, 'useRouter').mockReturnValueOnce(mock);
  }

  return jest.spyOn(nextRouter, 'useRouter').mockReturnValue(mock);
};
