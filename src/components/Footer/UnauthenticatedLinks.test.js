import React from 'react';

import { render } from '../../utils/testUtils';
import UnauthenticatedLinks from './UnauthenticatedLinks';

describe('<UnauthenticatedLinks />', () => {
  it('renders without crashing', () => {
    render(<UnauthenticatedLinks />);
  });
});
