import { renderHook } from '../../../testUtils';
import { createRouterMock } from '../../../testUtils/router';
import { useScrollRestoration } from '../hooks/useScrollRestoration';

const asPath = '/karma';
const renderOptions = { omitKarmaProvider: true };

describe('hooks/useScrollRestoration', () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'setItem');
    jest.spyOn(Storage.prototype, 'getItem');
    jest.spyOn(Storage.prototype, 'removeItem');

    jest.spyOn(window, 'addEventListener');

    Object.defineProperty(window, 'history', {
      value: {
        ...window.history,
        scrollRestoration: 'manual',
      },
    });
  });

  afterEach(() => {
    sessionStorage.clear();

    Object.defineProperty(window, 'history', {
      value: {
        ...window.history,
        scrollRestoration: undefined,
      },
    });
  });

  test('initially looks up sessionStorage', () => {
    const router = createRouterMock({
      asPath,
    });

    renderHook(() => {
      useScrollRestoration(router);
    }, renderOptions);

    expect(Storage.prototype.setItem).toHaveBeenCalledTimes(1);

    expect(Storage.prototype.getItem).toHaveBeenCalledTimes(1);
    expect(Storage.prototype.getItem).toHaveBeenCalledWith(asPath);
  });

  test('intially restores stored scroll position', () => {
    const coordinates = { x: 10, y: 10 };

    jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValueOnce(JSON.stringify(coordinates));
    const scrollToSpy = jest.spyOn(window, 'scrollTo');

    const router = createRouterMock({
      asPath,
    });

    renderHook(() => {
      useScrollRestoration(router);
    }, renderOptions);

    expect(Storage.prototype.getItem).toHaveBeenCalledWith(asPath);

    expect(scrollToSpy).toHaveBeenCalledTimes(1);
    expect(scrollToSpy).toHaveBeenCalledWith(coordinates.x, coordinates.y);
  });

  test('saves scroll position "beforeunload"', () => {
    const router = createRouterMock({
      asPath,
    });

    renderHook(() => {
      useScrollRestoration(router);
    }, renderOptions);

    expect(window.addEventListener).toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    );

    window.dispatchEvent(new Event('beforeunload'));

    expect(Storage.prototype.setItem).toHaveBeenCalledWith(
      asPath,
      JSON.stringify({ x: 0, y: 0 })
    );
  });

  test('on "routeChangeStart", saves position', () => {
    const router = createRouterMock({
      asPath,
    });

    renderHook(() => {
      useScrollRestoration(router);
    }, renderOptions);

    expect(router.events.on).toHaveBeenCalledWith(
      'routeChangeStart',
      expect.any(Function)
    );

    // @ts-expect-error ts doent know router is mocked
    const [[, listener]] = router.events.on.mock.calls;

    listener();

    expect(Storage.prototype.setItem).toHaveBeenCalledWith(
      router.asPath,
      JSON.stringify({ x: 0, y: 0 })
    );
  });

  test('on "routeChangeComplete", retrieves position and scrolls', () => {
    const router = createRouterMock({
      asPath,
    });

    const coordinates = { x: 10, y: 10 };

    jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValueOnce(JSON.stringify(coordinates));
    const scrollToSpy = jest.spyOn(window, 'scrollTo');

    renderHook(() => {
      useScrollRestoration(router);
    }, renderOptions);

    expect(router.events.on).toHaveBeenCalledWith(
      'routeChangeComplete',
      expect.any(Function)
    );

    // @ts-expect-error custom mock implementation to allow triggering popState
    router.beforePopState();

    // @ts-expect-error ts doesnt know router is mocked
    const [, [, listener]] = router.events.on.mock.calls;

    listener(asPath);

    expect(Storage.prototype.getItem).toHaveBeenCalledWith(asPath);

    expect(scrollToSpy).toHaveBeenCalledTimes(1);
    expect(scrollToSpy).toHaveBeenCalledWith(coordinates.x, coordinates.y);
  });
});
