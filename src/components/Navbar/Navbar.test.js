import React from 'react';

import render from '../../utils/testUtils';

import Navbar from '.';

describe('<Navbar />', () => {
  it('should render without crashing', () => {
    render(<Navbar />);
  });
});
