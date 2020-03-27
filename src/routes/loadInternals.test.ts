import { dynamicPathMatcherFactory } from './loadInternals';

const INDEX_PATH = '/';

const cases = [
  {
    path: '/user/:id?/inbox/:message?',
    params: {},
    expected: '/user',
  },
  {
    path: '/user/:id/inbox/:message?',
    params: { id: 1 },
    expected: '/user/1/inbox',
  },
  {
    path: '/user/:id/inbox/:message?',
    params: { id: 1, message: 1 },
    expected: '/user/1/inbox/1',
  },
];

describe('fn dynamicPathMatcherFactory', () => {
  it('should return a function', () => {
    const fn = dynamicPathMatcherFactory(INDEX_PATH);

    expect(typeof fn).toBe('function');
  });

  it('should return the same path as given if it does not include variables', () => {
    const fn = dynamicPathMatcherFactory(INDEX_PATH);

    expect(fn()).toBe(INDEX_PATH);
  });

  cases.forEach(({ path, params, expected }, index) => {
    it(`should return a converted path if given a path with variables, case ${
      index + 1
    }`, () => {
      const fn = dynamicPathMatcherFactory(path);

      expect(fn(params)).toBe(expected);
    });
  });

  it('should throw an error on a missing param', () => {
    const path = '/user/:id/inbox/:message?';
    const fn = dynamicPathMatcherFactory(path);

    const proxy = () => fn({ message: 1 });

    expect(proxy).toThrowError(
      `unknown param ":id" provided to path "${path}"`
    );
  });
});
