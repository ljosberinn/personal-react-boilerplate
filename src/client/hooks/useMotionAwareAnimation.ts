import { useAnimationPreference } from '@chakra-ui/core';

export function useMotionAwareAnimation(animation: string): string | undefined {
  const prefersReducedMotion = useAnimationPreference();

  return prefersReducedMotion ? undefined : animation;
}
