import { RouterContext } from 'next/dist/next-server/lib/router-context';
import type { NextRouter } from 'next/router';

import type { WithChildren } from '../src/client/Karma';

interface MockRouterContextProps extends WithChildren {
  router?: Partial<NextRouter>;
}

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
