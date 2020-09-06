import * as nextRouter from 'next/router';

export const createUseRouterMock = (
  value: Partial<ReturnType<typeof nextRouter.useRouter>> = {}
): jest.SpyInstance<nextRouter.NextRouter, []> => {
  return jest.spyOn(nextRouter, 'useRouter').mockReturnValueOnce({
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
  });
};
