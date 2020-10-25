import { usePrefersReducedMotion } from '@chakra-ui/core';

export function useMotionAwareAnimation(animation: string): string | undefined {
  const prefersReducedMotion = usePrefersReducedMotion();

  return prefersReducedMotion ? undefined : animation;
}
