import { renderHook } from '../../../testUtils';
import { usePageIsHydrated } from '../hooks/usePageIsHydrated';

describe('hooks/usePageIsHydrated', () => {
  test('returns true if within a browser-like env', () => {
    const { result } = renderHook(usePageIsHydrated);

    expect(result.current).toBe(true);
  });

  // not testing if always returning false on server as mocking window to be
  // undefined is hard to pull off and collides with React internals through
  // renderHook
});
