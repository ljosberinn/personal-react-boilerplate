import { RouterContext } from 'next/dist/next-server/lib/router-context';
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
    prefetch: jest.fn(),
    push: jest.fn(),
    query: {},
    reload: jest.fn(),
    replace: jest.fn(),
    route: '/',
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

export const createUseRouterMock = ({
  once = true,
  ...value
}: Partial<ReturnType<typeof nextRouter.useRouter>> &
  Options = {}): jest.SpyInstance<nextRouter.NextRouter, []> => {
  const mock = {
    asPath: '',
    back: jest.fn(),
    basePath: '',
    beforePopState: jest.fn(),
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
    ...value,
  };

  if (once) {
    return jest.spyOn(nextRouter, 'useRouter').mockReturnValueOnce(mock);
  }

  return jest.spyOn(nextRouter, 'useRouter').mockReturnValue(mock);
};
