import React from 'react';

import { lg } from '../../constants/breakpoints';
import { useBreakpoint } from '../../hooks';
import Desktop from './Desktop';
import Mobile from './Mobile';

export default function Navigation() {
  const breakpoint = useBreakpoint();

  return breakpoint === lg.name ? <Desktop /> : <Mobile />;
}
