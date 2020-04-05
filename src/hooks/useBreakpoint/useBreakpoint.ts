import { createBreakpoint } from 'react-use';

import { sm, md, lg } from '../../constants/breakpoints';

export default createBreakpoint({
  sm: sm.px,
  md: md.px,
  lg: lg.px,
});
