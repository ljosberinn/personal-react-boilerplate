import React from 'react';

import render, { defineMatchMedia } from '../../utils/testUtils';

import Navbar from '.';

defineMatchMedia();

describe('<Navbar />', () => {
  it('should render without crashing', () => {
    render(<Navbar />);
  });
});
