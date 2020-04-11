import { renderHook, act } from '@testing-library/react-hooks';

import { sm, lg, md } from '../../constants/breakpoints';
import useBreakpoint from './useBreakpoint';

beforeEach(() => {
  const resizeEvent = document.createEvent('Event');
  resizeEvent.initEvent('resize', true, true);

  Object.defineProperty(window, 'resizeTo', {
    writable: true,
    configurable: true,
    value: (width: number, height: number) => {
      // @ts-expect-error
      window.innerWidth = width || window.innerWidth;
      window.innerHeight = height || window.innerHeight;
      window.dispatchEvent(resizeEvent);
    },
  });
});

describe('useBreakpoint', () => {
  test('should execute without crashing', () => {
    renderHook(useBreakpoint);
  });

  test(`should recognize breakpoint sm`, () => {
    const { result } = renderHook(useBreakpoint);

    act(() => {
      window.resizeTo(sm.px - 1, 1000);
    });

    expect(result.current).toBe(sm.name);
  });

  test(`should recognize breakpoint md`, () => {
    const { result } = renderHook(useBreakpoint);

    act(() => {
      window.resizeTo(md.px - 1, 1000);
    });

    expect(result.current).not.toBe(md.name);

    act(() => {
      window.resizeTo(md.px + 1, 1000);
    });

    expect(result.current).toBe(md.name);
  });

  test(`should recognize breakpoint lg`, () => {
    const { result } = renderHook(useBreakpoint);

    act(() => {
      window.resizeTo(lg.px - 1, 1000);
    });

    expect(result.current).not.toBe(lg.name);

    act(() => {
      window.resizeTo(lg.px + 1, 1000);
    });

    expect(result.current).toBe(lg.name);
  });
});
