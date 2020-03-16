import React from 'react';

import render from '../../utils/testUtils';
import Menu from './Menu';

describe('<Menu />', () => {
  it('renders without crashing', () => {
    render(<Menu />);
  });
});
