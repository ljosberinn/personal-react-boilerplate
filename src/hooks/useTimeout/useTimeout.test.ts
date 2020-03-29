import { renderHook, act } from '@testing-library/react-hooks';

import useTimeout from './useTimeout';

describe('useTimeout', () => {
  test('should execute without crashing', () => {
    renderHook(() => useTimeout(1500));
  });

  test('should return a boolean', () => {
    const { result } = renderHook(() => useTimeout(1500));

    expect(typeof result.current).toBe('boolean');
  });

  test('should resolve to the opposite boolean after x ms', () => {
    jest.useFakeTimers();

    const { result } = renderHook(() => useTimeout(1500));

    expect(result.current).toBe(false);

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current).toBe(true);
  });

  test('should instantly resolve to true if ms equals to 0 ms', () => {
    const { result } = renderHook(() => useTimeout(0));

    expect(result.current).toBe(true);
  });

  test('should instantly resolve to true if ms equals to <0 ms', () => {
    const { result } = renderHook(() => useTimeout(-1000));

    expect(result.current).toBe(true);
  });
});
