import React from 'react';

import { lg } from '../../constants/breakpoints';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Desktop } from './Desktop';
import { Mobile } from './Mobile';

export default function Footer() {
  const breakpoint = useBreakpoint();

  return breakpoint === lg.name ? <Desktop /> : <Mobile />;
}
