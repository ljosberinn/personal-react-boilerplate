import React from 'react';

import render from '../../utils/testUtils';
import UnauthenticatedNavButtons from './UnauthenticatedNavButtons';

describe('<UnauthenticatedNavButtons />', () => {
  it('renders without crashing', () => {
    render(<UnauthenticatedNavButtons />);
  });
});
