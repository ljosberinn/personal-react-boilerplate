import { usePrefersReducedMotion } from '@chakra-ui/react';

export function useMotionAwareAnimation(animation: string): string | undefined {
  const prefersReducedMotion = usePrefersReducedMotion();

  return prefersReducedMotion ? undefined : animation;
}
