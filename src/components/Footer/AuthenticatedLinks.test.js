import React from 'react';

import render from '../../utils/testUtils';
import AuthenticatedLinks from './AuthenticatedLinks';

describe('<AuthenticatedLinks />', () => {
  it('renders without crashing', () => {
    render(<AuthenticatedLinks />);
  });
});
