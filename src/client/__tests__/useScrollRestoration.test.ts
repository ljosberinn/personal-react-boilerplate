import { renderHook } from '../../../testUtils';
import { useScrollRestoration } from '../hooks/useScrollRestoration';

describe('hooks/useScrollRestoration', () => {
  describe('if unsupported', () => {
    test('does nothing without scrollRestoration', () => {
      const sessionStorageGetSpy = jest.spyOn(window, 'sessionStorage', 'get');

      renderHook(useScrollRestoration);

      expect(sessionStorageGetSpy).not.toHaveBeenCalled();
    });

    test.todo('does nothing without sessionStorage');

    test.todo("does nothing if sessionStorage isn't writable");
  });

  describe('if supported', () => {
    test.skip('initially looks up sessionStorage', () => {
      Object.defineProperty(window, 'history', {
        value: {
          ...window.history,
          scrollRestoration: 'manual',
        },
      });

      const sessionStorageGetSpy = jest.spyOn(window, 'sessionStorage', 'get');
      renderHook(useScrollRestoration);

      expect(sessionStorageGetSpy).toHaveBeenCalledTimes(1);
      expect(sessionStorageGetSpy).toHaveBeenCalledWith(expect.any(String));

      Object.defineProperty(window, 'history', {
        value: {
          ...window.history,
          scrollRestoration: undefined,
        },
      });
    });

    test.todo('adds eventListener to beforeunload');

    test.todo('onRouteChangeStart, saves position');

    test.todo('onRouteChangeComplete, retrieves position and scrolls');
  });
});
