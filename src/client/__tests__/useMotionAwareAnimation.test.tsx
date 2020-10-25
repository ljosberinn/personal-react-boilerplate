import * as chakra from '@chakra-ui/core';

import { renderHook } from '../../../testUtils';
import { useMotionAwareAnimation } from '../hooks/useMotionAwareAnimation';

describe('hooks/useMotionAwareAnimation', () => {
  test('returns given animation given no media-query match', () => {
    jest.spyOn(chakra, 'usePrefersReducedMotion').mockReturnValueOnce(false);

    const mockAnimation = 'animation';

    const { result } = renderHook(() => useMotionAwareAnimation(mockAnimation));

    expect(result.current).toBe(mockAnimation);
  });

  test('returns given animation given a media-query match', () => {
    jest.spyOn(chakra, 'usePrefersReducedMotion').mockReturnValueOnce(true);

    const mockAnimation = 'animation';

    const { result } = renderHook(() => useMotionAwareAnimation(mockAnimation));

    expect(result.current).toBeUndefined();
  });
});
