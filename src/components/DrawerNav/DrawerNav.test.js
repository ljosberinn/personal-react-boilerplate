import React from 'react';

import render from '../../utils/testUtils';

import DrawerNav from '.';

describe('<DrawerNav />', () => {
  it('should render without crashing', () => {
    render(<DrawerNav />);
  });
});
