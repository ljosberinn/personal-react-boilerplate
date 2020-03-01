import React from 'react';

import render, { defineMatchMedia } from '../../utils/testUtils';

import DrawerNav from '.';

defineMatchMedia();

describe('<DrawerNav />', () => {
  it('should render without crashing', () => {
    render(<DrawerNav />);
  });
});
