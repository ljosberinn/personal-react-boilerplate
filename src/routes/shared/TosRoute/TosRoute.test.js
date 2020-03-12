import React from 'react';

import render from '../../../utils/testUtils';

import TosRoute from '.';

describe('<TosRoute />', () => {
  it('should render without crashing', () => {
    render(<TosRoute />);
  });
});
