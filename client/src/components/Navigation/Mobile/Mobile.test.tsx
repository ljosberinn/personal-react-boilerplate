import * as React from 'react';

import { render } from '../../../testUtils';
import Mobile from './Mobile';

describe('<Mobile />', () => {
  it('should render without crashing', () => {
    render(<Mobile />);
  });
});
